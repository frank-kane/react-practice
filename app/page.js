"use client";
import React, { useState } from "react";

let nextId = 2;

const TreeNode = ({ node, onAdd, depth = 0, prefix = "" }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <li>
      <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
        {prefix}
        {hasChildren ? (isOpen ? "▼─ " : "▶─ ") : "•─ "}
        {node.label}
        <button onClick={() => onAdd(node.id)}>➕</button>
        <button onClick={() => setIsOpen(!isOpen)}>⤵️</button>
      </div>

      {isOpen && hasChildren && (
        <ul style={{ listStyle: "none", paddingLeft: "1em" }}>
          {node.children.map((child, index) => {
            const isLast = index === node.children.length - 1;
            const childPrefix = prefix + (isLast ? "   " : "│  ");
            return (
              <TreeNode
                key={child.id}
                node={child}
                onAdd={onAdd}
                depth={depth + 1}
                prefix={childPrefix}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

const Tree = () => {
  const [tree, setTree] = useState({
    id: "1",
    label: "Root",
    children: []
  });

  const addNode = (parentId) => {
    const addToTree = (node) => {
      if (node.id === parentId) {
        const newId = `${node.id}.${node.children.length + 1}`;
        const newNode = {
          id: newId,
          label: `Node ${newId}`,
          children: []
        };
        return { ...node, children: [...node.children, newNode] };
      }

      return {
        ...node,
        children: node.children.map(addToTree)
      };
    };

    setTree((prevTree) => addToTree(prevTree));
  };

  return (
    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
      <TreeNode node={tree} onAdd={addNode} />
    </ul>
  );
};

export default Tree;
