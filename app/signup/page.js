import AuthBackground from "@/components/auth/AuthBackground";
import AuthHero from "@/components/auth/AuthHero";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "RTI Portal - Create Citizen Account",
  description: "Register as a citizen to file RTI requests, track applications, and receive official responses online.",
};

export default function SignupPage() {
  return (
    <AuthBackground>
      {/* Left Column: Branding, Citizen Pill, 3D RTI Card & Features */}
      <AuthHero type="signup" />

      {/* Right Column: Frosted Citizen Registration Card & Officer Notice */}
      <SignupForm />
    </AuthBackground>
  );
}
