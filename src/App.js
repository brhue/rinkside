import Schedule from "./Schedule";

function App() {
  return (
    <div>
      <header className="m-b-1">
        <nav className="container d-flex align-items-baseline justify-content-between">
          <h1>
            <a href="/">Hockey Info</a>
          </h1>
        </nav>
      </header>
      <main>
        <Schedule />
      </main>
      <footer className="text-center m-t-auto p-1">
        <small> &copy; 2021 Bradley Donahue</small>
      </footer>
    </div>
  );
}

export default App;
