import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Mode = "login" | "signup";

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 w-full">
      <span className="font-['Inter'] font-medium text-[#777] text-base">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#EBEDFF] border border-[#D0D5FF] rounded-[10px] h-11 px-5 font-['Inter'] text-sm text-[#1f1f1f] placeholder:text-[#a4a4a4] outline-none focus:border-[#4355FF]"
      />
    </label>
  );
}

function PasswordField({
  value,
  onChange,
  showForgot,
}: {
  value: string;
  onChange: (v: string) => void;
  showForgot?: boolean;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="font-['Inter'] font-medium text-[#777] text-base">Password</span>
      <div className="relative">
        <input
          type={shown ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="•••••••••"
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
      {showForgot && (
        <button type="button" className="self-end font-['Inter'] text-sm text-[#FC381E]">
          Forget password
        </button>
      )}
    </div>
  );
}

function SocialButtons() {
  const buttons = [
    {
      label: "Google",
      svg: (
        <svg viewBox="0 0 24 24" className="size-6">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
          <path fill="#EB4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
        </svg>
      ),
    },
    {
      label: "Apple",
      svg: (
        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
          <path d="M16.5 1.5c0 1.13-.46 2.21-1.21 3-.81.86-2.13 1.53-3.22 1.44-.13-1.1.41-2.24 1.13-2.97.81-.82 2.18-1.43 3.3-1.47zM20.5 17.13c-.32.74-.71 1.43-1.18 2.07-.64.88-1.16 1.49-1.57 1.83-.63.55-1.31.84-2.04.86-.52 0-1.15-.15-1.88-.45-.73-.3-1.41-.45-2.02-.45-.65 0-1.34.15-2.07.45-.73.3-1.32.46-1.77.47-.7.03-1.4-.27-2.09-.9-.44-.37-.99-1-1.63-1.91-.69-.97-1.26-2.1-1.7-3.39-.48-1.4-.71-2.76-.71-4.07 0-1.5.32-2.79.97-3.88.51-.87 1.19-1.55 2.04-2.06.85-.51 1.78-.77 2.78-.78.56 0 1.29.17 2.2.51.91.34 1.49.51 1.75.51.19 0 .84-.2 1.94-.6 1.04-.37 1.92-.52 2.65-.46 1.97.16 3.45.94 4.43 2.34-1.76 1.07-2.63 2.57-2.62 4.49.01 1.5.55 2.74 1.62 3.74.48.46 1.02.82 1.62 1.07-.13.38-.27.74-.41 1.09z" />
        </svg>
      ),
    },
    {
      label: "Twitter",
      svg: (
        <svg viewBox="0 0 24 24" className="size-6" fill="#1DA1F2">
          <path d="M23 4.95a9.6 9.6 0 0 1-2.71.74 4.72 4.72 0 0 0 2.07-2.6 9.4 9.4 0 0 1-3 1.14 4.71 4.71 0 0 0-8.02 4.29A13.36 13.36 0 0 1 1.64 3.6a4.71 4.71 0 0 0 1.46 6.28 4.68 4.68 0 0 1-2.13-.59v.06a4.71 4.71 0 0 0 3.78 4.62 4.74 4.74 0 0 1-2.13.08 4.71 4.71 0 0 0 4.4 3.27A9.45 9.45 0 0 1 1 19.27a13.33 13.33 0 0 0 7.22 2.12c8.66 0 13.4-7.18 13.4-13.4l-.02-.61A9.55 9.55 0 0 0 23 4.95z" />
        </svg>
      ),
    },
  ];
  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {buttons.map((b) => (
        <button
          key={b.label}
          type="button"
          className="flex-1 bg-white border border-[#CCC] rounded-lg py-3 grid place-items-center hover:bg-[#F8F9FC] transition-colors"
          aria-label={b.label}
        >
          {b.svg}
        </button>
      ))}
    </div>
  );
}

export default function Auth({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isSignup = mode === "signup";

  return (
    <div className="min-h-screen w-full bg-[#F6F7FB] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white sm:bg-transparent">
        <div className="sm:bg-white sm:shadow-[0_20px_60px_-20px_rgba(17,24,39,0.15)] sm:rounded-2xl sm:p-8 flex flex-col gap-6">
          <h1 className="font-['Poppins'] font-semibold text-[#333] text-2xl text-center">
            {isSignup ? "Sign Up" : "Login"}
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAuthed();
            }}
            className="flex flex-col gap-5"
          >
            <Field
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
            />
            {isSignup && (
              <Field
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={setUsername}
              />
            )}
            <PasswordField value={password} onChange={setPassword} showForgot={!isSignup} />

            <button
              type="submit"
              className={`h-11 rounded-[10px] font-['Inter'] font-medium text-white text-lg transition-colors ${
                isSignup ? "bg-[#4355FF] hover:bg-[#3445e6]" : "bg-[#0063F3] hover:bg-[#0052cc]"
              }`}
            >
              Next
            </button>

            <div className="text-center font-['Inter'] font-medium text-[#4355FF]">or</div>

            <SocialButtons />

            <button
              type="button"
              onClick={() => setMode(isSignup ? "login" : "signup")}
              className="font-['Inter'] font-medium text-[#4355FF] text-base text-center"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Not have account? Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
