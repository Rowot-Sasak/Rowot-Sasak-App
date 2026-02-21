import { LoginForm } from "../../components/auth/LoginForm";

export const metadata = {
  title: "Login | RowotSasak Admin",
  description: "Masuk ke dashboard manajemen budaya",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary">RowotSasak</h1>
            <p className="text-sm text-base-content/60 mt-2 font-medium">
              Welcome Back
            </p>
            <p className="text-xs text-base-content/40">
              Please login to your account
            </p>
          </div>
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-xs text-base-content/50">
              &copy; {new Date().getFullYear()} RowotSasak Team
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}