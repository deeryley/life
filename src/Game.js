import React, { useEffect, useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import produce from "immer";

export default function Buttons() {
  var [grid, setGrid] = useState();
  var [start, setStart] = useState(false);
  var [gridState, setGridState] = useState({
    rows: 10,
    cols: 10,
  });
  var [start, setStart] = useState(false);

  useEffect(() => {
    setGrid(GridArray(gridState.rows, gridState.cols));
  }, [gridState.rows]);

  function GridArray(row, col) {
    var grids = [];
    for (let i = 0; i < row; i++) {
      const row = [];
      for (let j = 0; j < col; j++) {
        row.push(Math.floor(Math.random() * 2));
      }
      grids.push(row);
    }
    return grids;
  }

  const runningRef = useRef(start);
  runningRef.current = start;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < gridState.rows; i++) {
          for (let k = 0; k < gridState.cols; k++) {
            var count = 0;
            if (i - 1 >= 0) {
              if (g[i - 1][k] == 1) count++;
            }
            if (i - 1 >= 0 && k - 1 >= 0) {
              if (g[i - 1][k - 1] == 1) count++;
            }
            if (i - 1 >= 0 && k + 1 < gridState.cols) {
              if (g[i - 1][k + 1] == 1) count++;
            }
            if (k - 1 >= 0) {
              if (g[i][k - 1] == 1) count++;
            }
            if (k + 1 < gridState.cols) {
              if (g[i][k + 1] == 1) count++;
            }
            if (i + 1 < gridState.rows) {
              if (g[i + 1][k] == 1) count++;
            }
            if (i + 1 < gridState.rows && k - 1 >= 0) {
              if (g[i + 1][k - 1] == 1) count++;
            }
            if (i + 1 < gridState.rows && k + 1 < gridState.cols) {
              if (g[i + 1][k + 1] == 1) count++;
            }

            if (count < 2 || count > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && count === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 2000);
  }, []);

  function handleSelect(e) {
    const selectedValue = e.target.value;
    setGridState({ rows: selectedValue, cols: selectedValue });
  }

  return (
    <>
      <div className="buttons">
        <button
          onClick={() => {
            setStart(!start);
            if (!start) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {start ? "Stop" : "Start"}
        </button>
        <button>Random</button>
        <label>Grid Size:</label>

        <select
          className="select"
          onChange={handleSelect}
          name="gridsize"
          id="gridsize"
        >
          <option value="10">10x10</option>
          <option value="30">30x30</option>
          <option value="50">50x50</option>
          <option value="60">60x100</option>
        </select>
      </div>

      <div
        style={{
          position: "fixed",
          zIndex: "-1",
          padding: "0",
          margin: "0",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "black",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridState.cols}, 10px)`,
            justifyContent: "center",
            alignItems: "center",
            marginTop: "100px",
          }}
        >
          {grid &&
            grid.map((row, i) =>
              row.map((col, k) => (
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: grid[i][k] ? "red" : "black",
                    outline: " 1px solid darkred",
                  }}
                  key={uuidv4()}
                  onClick={() => {
                    const newGrid = produce(grid, (gridCopy) => {
                      gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    });

                    setGrid(newGrid);

                    // var newGrid = grid
                    // newGrid[i][k] = grid[i][k] ? 0:1
                    // setGrid(newGrid)
                  }}
                />
              ))
            )}
        </div>
      </div>
    </>
  );
}
