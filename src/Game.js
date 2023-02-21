import React, { useEffect, useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import produce from 'immer';

export default function Buttons() {
	let [grid, setGrid] = useState();
	let [start, setStart] = useState(false);
	let [rows, setRows] = useState(10);
	let [cols, setCols] = useState(10);

	useEffect(() => {
		setGrid(GridArray(rows, cols));
	}, [rows, cols]);

	function GridArray(row, col) {
		let grids = [];
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

	const runSimulation = () => {
		if (!runningRef.current) {
			return;
		}

		setGrid((g) => {
			return produce(g, (gridCopy) => {
				for (let i = 0; i < rows; i++) {
					for (let k = 0; k < cols; k++) {
						let count = 0;
						if (i - 1 >= 0) {
							if (g[i - 1][k] == 1) count++;
						}
						if (i - 1 >= 0 && k - 1 >= 0) {
							if (g[i - 1][k - 1] == 1) count++;
						}
						if (i - 1 >= 0 && k + 1 < cols) {
							if (g[i - 1][k + 1] == 1) count++;
						}
						if (k - 1 >= 0) {
							if (g[i][k - 1] == 1) count++;
						}
						if (k + 1 < cols) {
							if (g[i][k + 1] == 1) count++;
						}
						if (i + 1 < rows) {
							if (g[i + 1][k] == 1) count++;
						}
						if (i + 1 < rows && k - 1 >= 0) {
							if (g[i + 1][k - 1] == 1) count++;
						}
						if (i + 1 < rows && k + 1 < cols) {
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
		setTimeout(runSimulation, 200);
	};

	function handleGridSizeChange(e) {
		setCols(e.target.value);
		setRows(e.target.value);
	}

	const handleStart = () => {
		setStart(!start);
		if (!start) {
			runningRef.current = true;
			runSimulation();
		}
	};

	return (
		<>
			<div className='buttons'>
				<button onClick={handleStart}>{start ? 'Stop' : 'Start'}</button>
				<label>Grid Size:</label>

				<select className='select' onChange={handleGridSizeChange} name='gridsize' id='gridsize'>
					<option value='10'>10x10</option>
					<option value='30'>30x30</option>
					<option value='50'>50x50</option>
					<option value='60'>60x100</option>
				</select>
			</div>

			<div className='background'>
				<div
					className='grid'
					style={{
						gridTemplateColumns: `repeat(${cols}, 10px)`,
					}}>
					{grid &&
						grid.map((row, i) =>
							row.map((col, k) => (
								<div
									className='cell'
									style={{
										backgroundColor: grid[i][k] ? 'red' : 'black',
									}}
									key={uuidv4()}
									onClick={() => {
										const newGrid = produce(grid, (gridCopy) => {
											gridCopy[i][k] = grid[i][k] ? 0 : 1;
										});

										setGrid(newGrid);
									}}
								/>
							))
						)}
				</div>
			</div>
		</>
	);
}
