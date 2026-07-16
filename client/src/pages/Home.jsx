import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <main className="home-page">
      <nav className="topbar">
        <div>
          <p className="eyebrow">Social app</p>
          <h1>Home</h1>
        </div>
        <button className="secondary-button" type="button" onClick={logout}>
          Logout
        </button>
      </nav>

      <section className="profile-summary">
        <div>
          <p className="label">Logged in as</p>
          <h2>{user?.username}</h2>
          <p>{user?.email}</p>
        </div>
      </section>
    </main>
  );
};

export default Home;
