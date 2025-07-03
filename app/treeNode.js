"use client";
import React, { useEffect, useState } from "react";

const TreeNode = ({ node, onAdd, onEdit, onDelete, depth = 0, prefix = "" }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDone, setIsDone] = useState(false);

  const hasChildren = node.children.length > 0;

  const unfinishedStyle = {
    border: "2px solid white",
    display: "flex",
    flexDirection: "column",
    width: 250,
    gap: 8,
    padding: 8,
    marginBottom: 6,
  };

  const finishedStyle = {
    backgroundColor: "green",
    border: "2px solid white",
    display: "flex",
    flexDirection: "column",
    width: 250,
    gap: 8,
    padding: 8,
    marginBottom: 6,
  };

  return (
    <li>
      <div style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
        {prefix}
        <div style={isDone ? finishedStyle : unfinishedStyle}>
          <div>{hasChildren ? (isOpen ? "▼─ " : "▶─ ") : "•─ "}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div>
              <strong>{node.id}</strong>
            </div>
            <input
              type="text"
              value={node.label}
              onChange={(e) => onEdit(node.id, e.target.value)}
              style={{ padding: 4, width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <button onClick={() => onAdd(node.id)}>➕ Add Child</button>
            <button onClick={() => setIsOpen(!isOpen)}>⤵️ Toggle</button>
            <button onClick={() => setIsDone(!isDone)}>✅ Done</button>
            {node.id !== "1" && (
              <button onClick={() => onDelete(node.id)}>🗑️ Delete</button>
            )}
          </div>
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
                onDelete={onDelete} // ✅ Forward delete handler here
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

  const deleteNode = (idToDelete) => {
  if (idToDelete === "1") return; // don't delete root

  // Remove the node
  const removeNode = (node) => {
    return {
      ...node,
      children: node.children
        .filter((child) => child.id !== idToDelete)
        .map(removeNode),
    };
  };

  const cleaned = removeNode(tree);

  // Rebuild IDs
  const reindexTree = (node, currentId = "1") => {
  let index = 1;

  const newChildren = node.children.map((child) => {
    const newId = `${currentId}.${index++}`;
    return reindexTree(child, newId);
  });

  return {
    ...node,
    id: currentId,
    label: `Node ${currentId}`, // 👈 This line renames the label
    children: newChildren,
  };
};

  setTree(reindexTree(cleaned));
};


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

  useEffect(() => {
    fetch("http://localhost:3001/tree")
      .then((res) => res.json())
      .then((data) => setTree(data))
      .catch((err) => console.error("Failed to load tree:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/tree", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tree),
    }).catch((err) => console.error("Failed to save tree:", err));
  }, [tree]);

  return (
    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
      <TreeNode
        node={tree}
        onAdd={addNode}
        onEdit={editNodeLabel}
        onDelete={deleteNode}
      />
    </ul>
  );
};

export default Tree;
