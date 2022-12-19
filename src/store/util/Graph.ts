/**
 * 边
 */
export interface Edge<v> {
  /**
   * 起点
   */
  from: number;
  /**
   * 终点
   */
  to: number;
  /**
   * 长度
   */
  length: number;
  /**
   * 值
   */
  value: v;
}

/**
 * 最短路径
 */
export interface ShortestPath<v> {
  /**
   * 最短距离
   */
  distance: number;
  /**
   * 路径
   */
  path: Array<number>;

  /**
   * 顶点
   */
  vertices: Array<Map<number, Edge<v>>>;
}

// const getMinIndex = (input: Array<number>): number => {
//   let min = Infinity
//   let index = 0
//   for (let i = 0; i < input.length; i++) {
//     if (input[i] < min) {
//       min = input[i]
//       index = i
//     }
//   }
//   return index
// }

/**
 * 有向无环图
 */
export class Graph<v> {
  vertices: Array<Map<number, Edge<v>>> = []

  /**
   * 向有向图中增加新边
   * @param edge 新增的边
   */
  addEdge (edge: Edge<v>): void {
    const { from, to } = edge
    if (!this.vertices[from]) {
      this.vertices[from] = new Map<number, Edge<v>>()
    }
    if (!this.vertices[to]) {
      this.vertices[to] = new Map<number, Edge<v>>()
    }
    this.vertices[from].set(to, edge)
  }

  /**
   * 计算从第一个节点（最后一个字）到最后一个节点（第一个字）的最短路径
   */
  shortestPath (): ShortestPath<v> {
    const nodes: Array<{ key: number; priority: number }> = []
    const distances: Array<number> = []
    const path: Array<number> = []

    for (let i = this.vertices.length - 1; i >= 0; i--) {
      distances[i] = i === this.vertices.length - 1 ? 0 : Infinity
      nodes.push({ key: i, priority: distances[i] })
    }

    while (nodes.length > 0) {
      // 找出当前最小的距离
      const node = nodes.sort((a, b) => a.priority - b.priority).shift()
      if (!node) {
        break
      }

      const shortest = node.key
      if (distances[shortest] === Infinity) {
        continue
      }

      // 计算从该顶点的所有出向边中距离最短的并更新距离, 记录路径
      for (const vertex of this.vertices[shortest].keys()) {
        const to = this.vertices[shortest].get(vertex)
        if (!to) {
          continue
        }

        const distance = distances[shortest] + to.length
        if (distance < distances[vertex]) {
          distances[vertex] = distance
          path[vertex] = shortest

          nodes.push({ key: vertex, priority: distance })
        }
      }
    }

    return { distance: distances[0], path, vertices: this.vertices }
  }
}
