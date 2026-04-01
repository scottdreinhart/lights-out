/**
 * Crossclimb Board Component
 * Visual graph renderer for the Crossclimb puzzle
 */

import React, { useRef, useEffect, useState } from 'react'
import styles from './CrossclimbBoard.module.css'
import {
  NODE_COLORS,
  EDGE_COLORS,
  NODE_RADIUS,
  EDGE_WIDTH,
  CANVAS_PADDING,
  ANIMATION_DURATION,
} from '../domain'

interface CrossclimbBoardProps {
  graph: Graph
  currentPath: NodeId[]
  hintNode: NodeId | null
  onNodeClick: (nodeId: NodeId) => void
  canMoveToNode: (nodeId: NodeId) => boolean
}

export const CrossclimbBoard: React.FC<CrossclimbBoardProps> = ({
  graph,
  currentPath,
  hintNode,
  onNodeClick,
  canMoveToNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  // Handle canvas resize
  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        const rect = container.getBoundingClientRect()
        setCanvasSize({
          width: Math.max(600, rect.width - 40),
          height: Math.max(400, rect.height - 100),
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges first (behind nodes)
    drawEdges(ctx, graph, currentPath)

    // Draw nodes
    drawNodes(ctx, graph, currentPath, hintNode, canMoveToNode)

    // Draw path highlights
    drawPath(ctx, graph, currentPath)

  }, [graph, currentPath, hintNode, canMoveToNode, canvasSize])

  const drawEdges = (
    ctx: CanvasRenderingContext2D,
    graph: Graph,
    currentPath: NodeId[]
  ) => {
    ctx.strokeStyle = EDGE_COLORS.traversable
    ctx.lineWidth = EDGE_WIDTH

    for (const edge of graph.edges.values()) {
      const fromNode = graph.nodes.get(edge.from)!
      const toNode = graph.nodes.get(edge.to)!

      // Check if edge is part of current path
      const isInPath = currentPath.some((nodeId, index) => {
        if (index === 0) return false
        const prevNodeId = currentPath[index - 1]
        return (nodeId === edge.from && prevNodeId === edge.to) ||
               (nodeId === edge.to && prevNodeId === edge.from)
      })

      ctx.strokeStyle = isInPath ? EDGE_COLORS.traversed : EDGE_COLORS.traversable
      ctx.globalAlpha = edge.traversable ? 1 : 0.3

      ctx.beginPath()
      ctx.moveTo(fromNode.position.x, fromNode.position.y)
      ctx.lineTo(toNode.position.x, toNode.position.y)
      ctx.stroke()

      // Draw edge weight
      const midX = (fromNode.position.x + toNode.position.x) / 2
      const midY = (fromNode.position.y + toNode.position.y) / 2

      ctx.fillStyle = '#666'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(edge.weight.toString(), midX, midY - 5)
    }

    ctx.globalAlpha = 1
  }

  const drawNodes = (
    ctx: CanvasRenderingContext2D,
    graph: Graph,
    currentPath: NodeId[],
    hintNode: NodeId | null,
    canMoveToNode: (nodeId: NodeId) => boolean
  ) => {
    for (const node of graph.nodes.values()) {
      const isInPath = currentPath.includes(node.id)
      const isCurrent = currentPath[currentPath.length - 1] === node.id
      const isHint = hintNode === node.id
      const canMove = canMoveToNode(node.id)

      // Determine node color
      let fillColor = NODE_COLORS.normal
      if (node.type === 'start') fillColor = NODE_COLORS.start
      else if (node.type === 'end') fillColor = NODE_COLORS.end
      else if (node.type === 'checkpoint') fillColor = NODE_COLORS.checkpoint
      else if (isInPath) fillColor = NODE_COLORS.visited
      else if (isCurrent) fillColor = NODE_COLORS.current

      // Draw node circle
      ctx.fillStyle = fillColor
      ctx.beginPath()
      ctx.arc(node.position.x, node.position.y, NODE_RADIUS, 0, 2 * Math.PI)
      ctx.fill()

      // Draw border
      ctx.strokeStyle = isHint ? '#fff' : '#333'
      ctx.lineWidth = isHint ? 3 : 2
      ctx.stroke()

      // Draw node label
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(
        node.type === 'start' ? 'S' :
        node.type === 'end' ? 'E' :
        node.type === 'checkpoint' ? 'C' :
        node.id.split('-')[1],
        node.position.x,
        node.position.y + 5
      )

      // Draw hint indicator
      if (isHint) {
        ctx.strokeStyle = '#ff0'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(node.position.x, node.position.y, NODE_RADIUS + 8, 0, 2 * Math.PI)
        ctx.stroke()
      }

      // Draw move indicator for valid moves
      if (canMove && !isInPath) {
        ctx.strokeStyle = '#0f0'
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.arc(node.position.x, node.position.y, NODE_RADIUS + 4, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }

  const drawPath = (
    ctx: CanvasRenderingContext2D,
    graph: Graph,
    currentPath: NodeId[]
  ) => {
    if (currentPath.length < 2) return

    ctx.strokeStyle = '#ff6b6b'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    const firstNode = graph.nodes.get(currentPath[0])!
    ctx.moveTo(firstNode.position.x, firstNode.position.y)

    for (let i = 1; i < currentPath.length; i++) {
      const node = graph.nodes.get(currentPath[i])!
      ctx.lineTo(node.position.x, node.position.y)
    }

    ctx.stroke()
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find clicked node
    for (const node of graph.nodes.values()) {
      const distance = Math.sqrt(
        (x - node.position.x) ** 2 + (y - node.position.y) ** 2
      )

      if (distance <= NODE_RADIUS) {
        onNodeClick(node.id)
        break
      }
    }
  }

  return (
    <div className={styles.crossclimbBoard}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          cursor: 'pointer',
          background: '#f8f9fa',
        }}
        tabIndex={0}
        aria-label="Crossclimb graph puzzle board"
      />
    </div>
  )
}