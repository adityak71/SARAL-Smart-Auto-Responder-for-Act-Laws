import AuthBackground from "@/components/auth/AuthBackground";
import AuthHero from "@/components/auth/AuthHero";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "RTI Portal - Sign In",
  description: "Sign in to your Citizen or Officer account on the AI-Powered RTI Portal.",
};

export default function LoginPage() {
  return (
    <AuthBackground>
      {/* Left Column: Branding, Emblem, AI Slogan & Status Tracker */}
      <AuthHero type="login" />

      {/* Right Column: Citizen / Officer Switcher & Frosted Login Card */}
      <LoginForm />
    </AuthBackground>
  );
}
