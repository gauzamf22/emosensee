import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Key } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNotifications } from "./notifications";
import { useTranslation } from "../translations";

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="font-['Inter'] font-medium text-[#777] text-base">{label}</span>
      <div className="relative">
        <input
          type={shown ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#EBEDFF] border border-[#D0D5FF] rounded-[10px] h-11 pl-5 pr-12 font-['Nunito'] text-sm text-[#1f1f1f] placeholder:text-[#a1a1aa] outline-none focus:border-[#4355FF]"
        />
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]"
        >
          {shown ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
        </button>
      </div>
    </div>
  );
}

export default function ResetCredentials({ onBack }: { onBack?: () => void }) {
  const { push } = useNotifications();
  const { t } = useTranslation();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!currentPassword) {
      setError(t.resetCredentials.errors.currentPasswordRequired);
      return;
    }

    if (!newUsername && !newPassword) {
      setError(t.resetCredentials.errors.provideUsernameOrPassword);
      return;
    }

    if (newUsername && newUsername.length < 3) {
      setError(t.resetCredentials.errors.usernameTooShort);
      return;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        setError(t.resetCredentials.errors.passwordTooShort);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(t.resetCredentials.errors.passwordMismatch);
        return;
      }
    }

    setLoading(true);

    try {
      // Verify current password by re-authenticating
      const { data: sessionData } = await supabase.auth.getSession();
      const userEmail = sessionData.session?.user?.email;

      if (!userEmail) {
        setError("Unable to verify user session");
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (signInError) {
        setError(t.resetCredentials.errors.invalidCurrentPassword);
        setLoading(false);
        return;
      }

      // Update username in user_metadata if provided
      if (newUsername) {
        const { error: usernameError } = await supabase.auth.updateUser({
          data: { username: newUsername },
        });

        if (usernameError) {
          setError(usernameError.message);
          setLoading(false);
          return;
        }
      }

      // Update password if provided
      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordError) {
          setError(passwordError.message);
          setLoading(false);
          return;
        }
      }

      // Success
      push({
        type: "success",
        message: t.resetCredentials.success,
      });

      // Go back to settings
      onBack?.();
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8EBFF] to-white pb-20">
      {/* Header */}
      <div className="bg-[#4355FF] pt-12 pb-6 px-6 rounded-b-[30px] shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="font-['Poppins'] font-semibold text-white text-2xl">
            {t.resetCredentials.title}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-[20px] shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#4355FF]/10 rounded-full p-3">
              <Key className="size-6 text-[#4355FF]" />
            </div>
            <div>
              <h2 className="font-['Poppins'] font-semibold text-[#333] text-lg">
                {t.resetCredentials.subtitle}
              </h2>
              <p className="font-['Inter'] text-[#777] text-sm">
                {t.resetCredentials.description}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <PasswordField
              label={t.resetCredentials.currentPassword}
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder={t.resetCredentials.placeholders.currentPassword}
            />

            <div className="flex flex-col gap-1 w-full">
              <span className="font-['Inter'] font-medium text-[#777] text-base">
                {t.resetCredentials.newUsername}
              </span>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={t.resetCredentials.placeholders.newUsername}
                className="bg-[#EBEDFF] border border-[#D0D5FF] rounded-[10px] h-11 px-5 font-['Inter'] text-sm text-[#1f1f1f] placeholder:text-[#a4a4a4] outline-none focus:border-[#4355FF]"
              />
            </div>

            <PasswordField
              label={t.resetCredentials.newPassword}
              value={newPassword}
              onChange={setNewPassword}
              placeholder={t.resetCredentials.placeholders.newPassword}
            />

            {newPassword && (
              <PasswordField
                label={t.resetCredentials.confirmPassword}
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder={t.resetCredentials.placeholders.confirmPassword}
              />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-[10px] font-['Inter'] font-medium text-white text-lg bg-[#4355FF] hover:bg-[#3445e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t.resetCredentials.updating : t.resetCredentials.updateButton}
            </button>

            <p className="font-['Inter'] text-[#777] text-xs text-center">
              {t.resetCredentials.note}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
