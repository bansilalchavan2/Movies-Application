import React, { useState, useEffect } from "react";
import moviesService from "../services/movies.service";
import { useNavigate, useParams } from 'react-router-dom';
const Movies = props => {
  const initialMoviesState = {
    id: null,
    name: "",
    cast: "",
    genre: "",
    rating: 0
  };
  const { id } = useParams();
  const [movies, setMovies] = useState(initialMoviesState);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const getMovies = id => {
    moviesService.getMovie(id)
      .then(response => {
        setMovies(response.data.movie);
        console.log(response.data.movie);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    console.log(props);
    getMovies(id);
  }, id);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMovies({ ...movies, [name]: value });
  };

  const updateMovies = () => {
    moviesService.updateMovie(movies.id, movies)
      .then(response => {
        console.log(response.data);
        setMessage("The movie was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteMovie = () => {
    moviesService.removeMovie(movies.id)
      .then(response => {
        console.log(response.data);
        navigate("/movies");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {movies ? (
        <div className="edit-form" class="col-6">
          <h4>Update Movie</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={movies.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Cast</label>
              <input
                type="text"
                className="form-control"
                id="cast"
                name="cast"
                value={movies.cast}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Genre</label>
              <input
                type="text"
                className="form-control"
                id="genre"
                name="genre"
                value={movies.genre}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Rating</label>
              <input
                type="text"
                className="form-control"
                id="rating"
                name="rating"
                value={movies.rating}
                onChange={handleInputChange}
              />
            </div>
          </form>
          <button
            type="submit"
            className="badge badge-success"
            onClick={updateMovies}
          >
            Update
          </button>
          <button className="badge badge-danger mr-2" onClick={deleteMovie}>
            Delete
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Movie...</p>
        </div>
      )}
    </div>
  );
};

export default Movies;
