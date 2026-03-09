import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page not found</p>
      <Link
        to="/"
        className="mt-6 btn-primary"
      >
        Go back home
      </Link>
    </div>
  );
}
