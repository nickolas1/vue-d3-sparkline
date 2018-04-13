import MinHeap from "./MinHeap.js";

class Visvalingham {
  static calculateTriangles(points, xAccessor, yAccessor) {
    // const heap = new Heap((a, b) => {if (a && b) return a[1]._area - b[1]._area})
    const heap = new MinHeap((a, b) => a[1]._area - b[1]._area);
    let maxArea = 0;
    const triangles = [];

    for (let i = 1; i < points.length - 1; ++i) {
      const triangle = points.slice(i - 1, i + 2);
      if ((triangle[1]._area = area(triangle))) {
        heap.push(triangle);
        triangles.push(triangle);
      }
    }
    // heap.push(triangles)

    for (let i = 0; i < triangles.length; ++i) {
      const triangle = triangles[i];
      triangle.previous = triangles[i - 1];
      triangle.next = triangles[i + 1];
    }
    let triangle;
    while ((triangle = heap.pop())) {
      // If the area of the current point is less than that of the previous point
      // to be eliminated, use the latter's area instead. This ensures that the
      // current point cannot be eliminated without eliminating previously-
      // eliminated points.
      if (triangle[1]._area < maxArea) triangle[1]._area = maxArea;
      else maxArea = triangle[1]._area;

      if (triangle.previous) {
        triangle.previous.next = triangle.next;
        triangle.previous[2] = triangle[2];
        update(triangle.previous);
      } else {
        triangle[0]._area = triangle[1]._area;
      }

      if (triangle.next) {
        triangle.next.previous = triangle.previous;
        triangle.next[0] = triangle[0];
        update(triangle.next);
      } else {
        triangle[2]._area = triangle[1]._area;
      }
    }

    function update(triangle) {
      heap.remove(triangle);
      triangle[1]._area = area(triangle);
      heap.push(triangle);
    }

    function area(t) {
      return (
        0.5 *
        Math.abs(
          xAccessor(t[0]) * (yAccessor(t[1]) - yAccessor(t[2])) +
            xAccessor(t[1]) * (yAccessor(t[2]) - yAccessor(t[0])) +
            xAccessor(t[2]) * (yAccessor(t[0]) - yAccessor(t[1]))
        )
      );
    }
  }

  static filter(points, pixelFactor = 1, threshold = 0.5) {
    const result = points.filter(d => d._area * pixelFactor > threshold);
    console.log(pixelFactor, points.length, result.length);
    return result;
  }
}

export default Visvalingham;
