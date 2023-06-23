import './css/Navi.css';

function Navi() {
    const element = (
      <nav class="sticky-top d-flex justify-content-center navbar navbar-expand-lg navbar-light bg-light">
        <div class="d-flex justify-content-center">
          <a href="/"><img class='logo' src="/images/logo-s.png"></img></a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link" href="/">Home<span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/about">About Us</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/recruit">Recruit</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/join" onclick="openPopup()">Sign in</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/login">login</a>
              </li>
            </ul>
          </div>
      </div>
    </nav>
    );
  
    return (element);
  }
  
  export default Navi;