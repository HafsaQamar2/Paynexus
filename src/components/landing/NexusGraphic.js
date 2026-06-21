"use client";

import { motion } from "framer-motion";

const nodes = [
  { id: "invoices", label: "Invoices", x: 40, y: 40 },
  { id: "payroll", label: "Payroll", x: 360, y: 40 },
  { id: "clients", label: "Clients", x: 40, y: 280 },
  { id: "employees", label: "Employees", x: 360, y: 280 },
];

const center = { x: 200, y: 160 };

const lineDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.9, delay: 0.3 + i * 0.15, ease: "easeInOut" },
  }),
};

const nodeAppear = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function NexusGraphic() {
  return (
    <motion.svg
      viewBox="0 0 400 320"
      className="h-auto w-full max-w-lg"
      initial="hidden"
      animate="visible"
      role="img"
      aria-label="Diagram showing invoices, payroll, clients and employees connecting into a single PayNexus hub"
    >
      {nodes.map((n, i) => (
        <motion.line
          key={`line-${n.id}`}
          x1={n.x}
          y1={n.y}
          x2={center.x}
          y2={center.y}
          stroke="#3A4F85"
          strokeWidth="2"
          strokeDasharray="6 6"
          custom={i}
          variants={lineDraw}
        />
      ))}

      {/* Center hub */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r="34"
        fill="#0B1F4D"
        custom={0}
        variants={nodeAppear}
      />
      <motion.circle
        cx={center.x}
        cy={center.y}
        r="34"
        fill="none"
        stroke="#0B1F4D"
        strokeOpacity="0.25"
        strokeWidth="10"
        animate={{ r: [34, 50, 34], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x={center.x} y={center.y + 5} textAnchor="middle" fontSize="13" fontWeight="600" fill="#FFFFFF">
        PayNexus
      </text>

      {nodes.map((n, i) => (
        <motion.g key={n.id} custom={i} variants={nodeAppear}>
          <circle cx={n.x} cy={n.y} r="26" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1E293B">
            {n.label}
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
}
