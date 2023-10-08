import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import moviesService from "../services/movies.service";
import { useTable } from "react-table";

const MoviesList = (props) => {
  const [movies, setMovies] = useState([]);
  const moviesRef = useRef();
  moviesRef.current = movies;
  const navigate = useNavigate();
  useEffect(() => {
    retrieveMovies();
  }, []);

  const retrieveMovies = () => {
    moviesService.getMoviesList()
      .then((response) => {
        
        setMovies(response.data.moviesList);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openMovie = (rowIndex) => {
    const id = moviesRef.current[rowIndex].id;
    console.log(props.history);
    navigate(`/movies/${id}`);
  };

  const deleteMovie = (rowIndex) => {
    const id = moviesRef.current[rowIndex].id;

    moviesService.removeMovie(id)
      .then((response) => {
        navigate("/movies");

        let newMovies = [...moviesRef.current];
        newMovies.splice(rowIndex, 1);

        setMovies(newMovies);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Cast",
        accessor: "cast",
      },
      {
        Header: "Genre",
        accessor: "genre",
      },
      {
        Header: "Rating",
        accessor: "rating",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openMovie(rowIdx)}>edit
              </span>
              <span onClick={() => deleteMovie(rowIdx)}>|Delete
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: movies,
  });

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          Movies List
        </div>
      </div>
      <div className="col-md-12 list">
        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoviesList;

