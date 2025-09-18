import passport from "../../utils/passport.js";
import { User } from "../../models/user.model.js";


// Helper function: generate tokens and save refresh token in DB
const generateAccessAndRefereshTokens = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Token generation failed: " + error.message);
  }
};


// Step 1: Redirect to Google
const authenticateController = passport.authenticate("google", {
  scope: ["profile", "email"],
});


// Step 2: Handle Google callback
const callbackController = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user) => {
    if (err || !user) {
      console.log("Google login error:", err);
      return res.redirect("/?error=login_failed");
    }

    try {
      const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user);

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      };

      res.cookie("refreshToken", refreshToken, options);
      res.cookie("accessToken", accessToken, options);

      // Redirect to frontend with token (optional)
      res.redirect("http://localhost:3000/");
    } catch (e) {
      console.error("Token creation error:", e);
      res.redirect("/?error=token_failed");
    }
  })(req, res, next);
};

// Step 3: Refresh Token
const refreshController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const options={
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    }
    res.cookie("refreshToken", newRefreshToken,options);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Refresh token expired/invalid" });
  }
};

const logout=(req,res)=>{
    const options={
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    }
    res.clearCookie("accessToken",options);
    res.clearCookie("refreshToken", options);
    res.status(200).json({ message: "Cookies cleared" });
}

const meController = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: req.user });
};

export { authenticateController, callbackController, refreshController ,logout, meController};