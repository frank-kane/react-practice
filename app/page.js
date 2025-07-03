"use client";
import React, { useState } from "react";
import Tree from "./treeNode"; // Make sure this is a valid React component

const Tab = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 20px",
      marginRight: "5px",
      cursor: "pointer",
      borderBottom: isActive ? "2px solid blue" : "2px solid transparent",
      background: "none",
      border: "none",
      fontWeight: isActive ? "bold" : "normal",
    }}
  >
    {label}
  </button>
);

// ✅ This is your main exported page component
export default function Page() {
  const [activeTab, setActiveTab] = useState("Tab1");

  const renderContent = () => {
    switch (activeTab) {
      case "Tab1":
        return <Tree />; // Make sure Tree is a component, not just a JS object
      case "Tab2":
        return <div>This is Tab 2 content</div>;
      case "Tab3":
        return <div>This is Tab 3 content</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ borderBottom: "1px solid #ccc" }}>
        <Tab label="Tree Node" isActive={activeTab === "Tab1"} onClick={() => setActiveTab("Tab1")} />
        <Tab label="Tab2" isActive={activeTab === "Tab2"} onClick={() => setActiveTab("Tab2")} />
        <Tab label="Tab3" isActive={activeTab === "Tab3"} onClick={() => setActiveTab("Tab3")} />
      </div>
      <div style={{ padding: "20px" }}>
        {renderContent()}
      </div>
    </div>
  );
}
