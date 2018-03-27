import React, { Component } from "react";
import "./App.css";

const Header = () => {
  return (
    <header className="App-header">
      <h1 className="App-title">My Movies</h1>
    </header>
  );
};

const MinRatingSelect = ({ value, onChange }) => {
  const options = [<option key="0" value="0">none</option>];
  for (let i = 5; i <= 10; i = i + 0.5) {
    options.push(<option key={i} value={i}>{i}</option>);
  }
  return (
    <div>
      <label>Choose a minimum rating: </label>
      <select value={value} onChange={onChange}>
        {options}
      </select>
    </div>
  );
};

const MovieGrid = ({ movies, minRating }) => {
  const movieGrid = movies
    .filter(movie => movie.vote_average >= minRating)
    .map(movie => {
      const imageSrc = `http://image.tmdb.org/t/p/w200/${movie.poster_path}`;
      return (
        <div className="MovieGrid--movie-item" key={movie.id}>
          <img
            width="200"
            src={imageSrc}
            alt={movie.title}
          />
          <h3>{movie.title}</h3>
          <div>Rating: {movie.vote_average}</div>
          <div>Review Count: {movie.vote_count}</div>
        </div>
      );
    });
  return <div className="MovieGrid">{movieGrid}</div>;
};

const Attribution = () => {
  return (
    <div>
      <img height="20" src="tmdb-logo.png" alt="tmdb logo"/>
      <span>
        This product uses the TMDb API but is not endorsed or certified by TMDb.
      </span>
    </div>
  )
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", minRating: "4.5" };
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleMinRatingChange = this.handleMinRatingChange.bind(this);
  }

  handleSearchTextChange(e) {
    this.setState({ searchText: e.target.value });
  }

  handleMinRatingChange(e) {
    this.setState({ minRating: e.target.value });
  }

  render() {
    return (
      <main>
        <MinRatingSelect
          value={this.state.minRating}
          onChange={this.handleMinRatingChange}
        />
        <MovieGrid movies={this.props.movies}minRating={this.state.minRating} />
        <Attribution />
      </main>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {movies: []};
  }

  componentDidMount() {
    const self = this;
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1`)
      .then(response => {
        return response.json();
      })
      .then(json =>  {
        self.setState({movies: json.results})
    });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Main movies={this.state.movies} />
      </div>
    );
  }
}

export default App;
