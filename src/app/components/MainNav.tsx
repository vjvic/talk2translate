import React from "react";
import Image from "next/image";

const MainNav = () => {
  return (
    <nav className="shadow mb-10">
      <header>
        <div className="container mx-auto py-5 px-2 lg:px-0 text-2xl text-blue  font-semibold text-blue-500 flex items-center">
          <Image src="/header.png" alt="translating" width={50} height={50} />
          <h1>Talk2Translate</h1>
        </div>
      </header>
    </nav>
  );
};

export default MainNav;
