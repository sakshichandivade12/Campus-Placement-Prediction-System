
import { UserRound, LogOut } from "lucide-react";
import "./UserProfile.css";

export default function UserProfile({ user, onLogout }) {
  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="user-avatar">
        <UserRound size={20} />
      </div>

      <div className="user-details">
        <span className="user-name">{user.name}</span>
        <span className="user-email">{user.email}</span>
      </div>

      <button
        type="button"
        className="user-logout"
        onClick={onLogout}
        title="Log out"
      >
        <LogOut size={17} />
        <span>Log out</span>
      </button>
    </div>
  );
}