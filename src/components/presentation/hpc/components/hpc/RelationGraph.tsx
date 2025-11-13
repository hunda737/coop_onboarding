import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

interface Node {
  id: string;
  type: "high-profile" | "connection";
  name: string;
  fixed?: boolean;
  coopCustomer?: boolean;
  x?: number;
  y?: number;
  image?: string;
  imgElement?: HTMLImageElement;
}

interface Link {
  source: string;
  target: string;
  strength?: number;
  direction?: string;
}

const RelationGraph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const graphRef = useRef<any>(null);

  const predefinedNodes: Node[] = [
    {
      id: "customer1",
      name: "Yared Mesele",
      type: "high-profile",
      coopCustomer: true,
      x: 0,
      y: 0,
      image:
        "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    },
    {
      id: "connection1",
      name: "Yared Mesele",
      type: "connection",
      coopCustomer: true,
      image: "https://via.placeholder.com/40?text=YM",
    },
    {
      id: "connection2",
      name: "Hundaol Niguse",
      type: "connection",
      image: "https://via.placeholder.com/40?text=HN",
    },
    {
      id: "connection3",
      name: "Biniam Fikru",
      type: "connection",
      image: "https://via.placeholder.com/40?text=BF",
    },
    {
      id: "connection4",
      name: "Tamiru Diriba",
      type: "connection",
      coopCustomer: true,
      image: "https://via.placeholder.com/40?text=YD",
    },
    {
      id: "connection5",
      name: "Temam Hashim",
      type: "connection",
      image: "https://via.placeholder.com/40?text=TM",
    },
    {
      id: "subConnection1",
      name: "Nahili",
      type: "connection",
      coopCustomer: true,
      image: "https://via.placeholder.com/40?text=N",
    },
    {
      id: "subConnection2",
      name: "Gemechu",
      type: "connection",
      coopCustomer: true,
      image: "https://via.placeholder.com/40?text=G",
    },
    {
      id: "subConnection3",
      name: "Etana Alemu",
      type: "connection",
      image: "https://via.placeholder.com/40?text=EA",
    },
  ];

  const predefinedLinks: Link[] = [
    {
      source: "customer1",
      target: "connection1",
      strength: 3,
      direction: "in",
    },
    { source: "customer1", target: "connection2", direction: "out" },
    {
      source: "customer1",
      target: "connection3",
      strength: 6,
      direction: "in",
    },
    {
      source: "customer1",
      target: "connection4",
      strength: 2,
      direction: "in",
    },
    {
      source: "connection5",
      target: "customer1",
      direction: "out",
      strength: 3,
    },
    { source: "connection4", target: "subConnection1", direction: "out" },
    {
      source: "subConnection3",
      target: "connection4",
      strength: 6,
      direction: "in",
    },
    { source: "connection5", target: "subConnection2", direction: "in" },
  ];

  useEffect(() => {
    const preloadImages = async () => {
      const nodesWithImages = await Promise.all(
        predefinedNodes.map(async (node) => {
          if (node.image) {
            const img = new Image();
            img.src = node.image;
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
            return { ...node, imgElement: img };
          }
          return node;
        })
      );

      setNodes(nodesWithImages);
      setLinks(predefinedLinks);
    };

    preloadImages();
  }, []);

  const nodeCanvasObject = (node: Node, ctx: CanvasRenderingContext2D) => {
    const { x, y, imgElement } = node;
    const size = 10;

    if (node.type === "high-profile") {
      // Outer stroke for high-profile node
      ctx.beginPath();
      ctx.arc(x!, y!, size / 2 + 3, 0, 2 * Math.PI, false);
      ctx.strokeStyle = "#00ADEF"; // Gold outer stroke
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Regular stroke for all nodes
    ctx.beginPath();
    ctx.arc(x!, y!, size / 2 + 1, 0, 2 * Math.PI, false);
    ctx.strokeStyle = node.coopCustomer ? "#00ADEF" : "#EE7B28";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    if (imgElement) {
      // Image rendering within the node
      ctx.save();
      ctx.beginPath();
      ctx.arc(x!, y!, size / 2, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(imgElement, x! - size / 2, y! - size / 2, size, size);

      ctx.restore();
    }
  };

  const handleNodeClick = (node: Node) => {
    alert(node.name);
  };

  return (
    <div className="">
      <ForceGraph2D
        ref={graphRef}
        onNodeClick={handleNodeClick}
        graphData={{ nodes, links }}
        nodeCanvasObject={nodeCanvasObject}
        linkWidth={(link: Link) => (link.strength ? link.strength / 2 : 1)}
        linkColor={(link: Link) => {
          const strength = link.strength || 1;
          const greenIntensity = Math.min(170, Math.floor(50 + strength * 40));
          return `rgb(0, ${greenIntensity}, 0)`;
        }}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={() => 0.01}
        linkDirectionalParticleWidth={(link: Link) =>
          link.strength ? link.strength / 2 : 1.5
        }
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1}
        width={740}
        height={280}
        cooldownTicks={100}
        onEngineStop={() => graphRef.current.zoomToFit(500)}
      />
    </div>
  );
};

export default RelationGraph;
