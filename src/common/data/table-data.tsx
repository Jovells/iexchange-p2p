export const data = [
    { name: "John Doe", age: 25, email: "john@example.com", country: "USA", occupation: "Engineer" },
    { name: "Jane Smith", age: 30, email: "jane@example.com", country: "UK", occupation: "Designer" },
];

export const columns: any = [
    {
      key: 'name',
      label: 'name',
      render: (row: any) => <span className="font-bold">{row.name}</span>,
    },
    {
      key: 'age',
      label: 'Age',
      render: (row: any) => <span className="font-bold">{row.age}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (row: any) => {
        return (
          //multi row rendering
          <div>
            <p className="font-bold">{row.name}</p>
            <span className="font-bold">{row.email}</span>
          </div>
        )
      },
    },
    {
      key: 'country',
      label: 'Country',
      render: (row: any) => <span className="font-bold">{row.country}</span>,
    },
    {
      key: 'occupation',
      label: 'Occupation',
      render: (row: any) => <span className="font-bold">{row.occupation}</span>,
    },
  ]