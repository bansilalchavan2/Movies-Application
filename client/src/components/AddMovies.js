import React, { useState } from "react";
import moviesService from "../services/movies.service";

const AddMovies = () => {
  const initialMoviesState = {
    id: null,
    name: "",
    cast: "",
    genre: "",
    rating: 0
  };
  const [movies, setMovies] = useState(initialMoviesState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMovies({ ...movies, [name]: value });
  };

  const saveMovie = () => {
    var data = {
      name: movies.name,
      cast: movies.cast,
      genre: movies.genre,
      rating: movies.rating
    };

    moviesService.addMovies(data)
      .then(response => {
        setMovies({
          id: response.data.id,
          name: response.data.name,
          cast: response.data.cast,
          genre: response.data.genre
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newMovies = () => {
    setMovies(initialMoviesState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form" class="col-6">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newMovies}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={movies.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cast">Cast</label>
            <input
              type="text"
              className="form-control"
              id="cast"
              required
              value={movies.cast}
              onChange={handleInputChange}
              name="cast"
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Genre</label>
            <input
              type="text"
              className="form-control"
              id="genre"
              required
              value={movies.genre}
              onChange={handleInputChange}
              name="genre"
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Rating</label>
            <input
              type="number"
              className="form-control"
              id="rating"
              required
              value={movies.rating}
              onChange={handleInputChange}
              name="rating"
            />
          </div>
          <button onClick={saveMovie} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddMovies;
