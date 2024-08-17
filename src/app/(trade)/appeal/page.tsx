
import GridTable from '@/components/datatable';
import FaqsSection from '@/components/sections/Faqs';
import React from 'react'

const Appealls = () => {

  const columns = ["Name", "Age", "Email", "Country", "Occupation"];

  const data = [
    { Name: "John Doe", Age: 25, Email: "john@example.com", Country: "USA", Occupation: "Developer" },
    { Name: "Jane Smith", Age: 30, Email: "jane@example.com", Country: "UK", Occupation: "Designer" },
  ];

  return (
    <div className="container mx-auto p-0 py-4">
      <div className="flex flex-col gap-16">
        <GridTable columns={columns} data={data} itemsPerPage={2} />
        <FaqsSection />
      </div>
    </div>
  );
}

export default Appealls