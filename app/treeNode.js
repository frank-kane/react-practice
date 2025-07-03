"use client";
import React, { useState } from "react";

const TreeNode = ({ node, onAdd, onEdit, depth = 0, prefix = "" }) => {
  const [isOpen, setIsOpen] = useState(true);

  const hasChildren = node.children.length > 0;

  return (
    <li>
      <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
        {prefix}
        <div
          style={{
            border: "2px solid white",
            display: "flex",
            flexDirection: "column",
            width: 250,
            gap: 8,
            padding: 8,
            marginBottom: 6,
          }}
        >
          <div>{hasChildren ? (isOpen ? "▼─ " : "▶─ ") : "•─ "}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div><strong>{node.id}</strong></div>
            <input
              type="text"
              value={node.label}
              onChange={(e) => onEdit(node.id, e.target.value)}
              style={{ padding: 4, width: "100%" }}
            />
          </div>

          <button onClick={() => onAdd(node.id)}>➕ Add Child</button>
          <button onClick={() => setIsOpen(!isOpen)}>⤵️ Toggle</button>
        </div>
      </div>

      {isOpen && hasChildren && (
        <ul
          style={{
            listStyle: "none",
            paddingLeft: "1em",
            marginLeft: 200,
          }}
        >
          {node.children.map((child, index) => {
            const isLast = index === node.children.length - 1;
            const childPrefix = prefix + (isLast ? "   " : "│  ");
            return (
              <TreeNode
                key={child.id}
                node={child}
                onAdd={onAdd}
                onEdit={onEdit}
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
    children: [],
  });

  const addNode = (parentId) => {
    const addToTree = (node) => {
      if (node.id === parentId) {
        const newId = `${node.id}.${node.children.length + 1}`;
        const newNode = {
          id: newId,
          label: `Node ${newId}`,
          children: [],
        };
        return { ...node, children: [...node.children, newNode] };
      }

      return {
        ...node,
        children: node.children.map(addToTree),
      };
    };

    setTree((prevTree) => addToTree(prevTree));
  };

  const editNodeLabel = (id, newLabel) => {
    const updateLabel = (node) => {
      if (node.id === id) {
        return { ...node, label: newLabel };
      }
      return {
        ...node,
        children: node.children.map(updateLabel),
      };
    };

    setTree((prevTree) => updateLabel(prevTree));
  };

  return (
    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
      <TreeNode node={tree} onAdd={addNode} onEdit={editNodeLabel} />
    </ul>
  );
};

export default Tree;
