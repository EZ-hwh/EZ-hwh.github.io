import { asset } from "@/lib/asset";

export default function NotFound() {
  return (
    <div className="page not-found">
      <h1>This page doesn’t exist.</h1>
      <p>
        <a href={asset("/")}>Go to the homepage</a>
      </p>
    </div>
  );
}
