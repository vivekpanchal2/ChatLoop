import React from "react";

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <div className="flex flex-col items-center w-full h-screen">
      <div className="w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold uppercase mb-8">
          {heading}
        </h1>
        <div className="w-full overflow-auto" style={{ height: "80%" }}>
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.field}
                    className="px-4 py-2 text-white bg-richblack-500 border-b"
                    style={{ width: col.width }}
                  >
                    {col.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-100">
                  {columns.map((col) => (
                    <td
                      key={col.field}
                      className="px-4 py-2"
                      style={{ height: `${rowHeight}px` }}
                    >
                      {col.renderCell
                        ? col.renderCell({ row })
                        : typeof row[col.field] === "boolean"
                        ? row[col.field]
                          ? "Yes"
                          : "No"
                        : row[col.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
