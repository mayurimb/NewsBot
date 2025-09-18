import "../styles/Header.scss";

function Header({ onReset }) {
  return (
    <header className="header">
      <h1>NewsBot</h1>
      <button className="reset-btn" onClick={onReset}>
        Reset Chat
      </button>
    </header>
  );
}
export default Header;
