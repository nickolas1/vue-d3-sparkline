class MinHeap {
  constructor(comparator = MinHeap.defaultComparator()) {
    this.array = [];
    this.comparator = comparator;
  }

  static defaultComparator(a, b) {
    return a - b;
  }

  push() {
    for (let i = 0; i < arguments.length; ++i) {
      const object = arguments[i];
      this.up((object.index = this.array.push(object) - 1));
    }
    return this.array.length;
  }

  pop() {
    const removed = this.array[0];
    const object = this.array.pop();
    if (this.array.length) {
      this.array[(object.index = 0)] = object;
      this.down(0);
    }
    return removed;
  }

  size() {
    return this.array.length;
  }

  remove(removed) {
    const i = removed.index;
    const object = this.array.pop();
    if (i !== this.array.length) {
      this.array[(object.index = i)] = object;
      this.comparator(object, removed) < 0 ? this.up(i) : this.down(i);
    }
    return i;
  }

  up(i) {
    const object = this.array[i];
    while (i > 0) {
      const up = ((i + 1) >> 1) - 1;
      const parent = this.array[up];
      if (this.comparator(object, parent) >= 0) break;
      this.array[(parent.index = i)] = parent;
      this.array[(object.index = i = up)] = object;
    }
  }

  down(i) {
    const object = this.array[i];
    while (i >= 0) {
      const right = (i + 1) * 2;
      const left = right - 1;
      let down = i;
      let child = this.array[down];
      if (
        left < this.array.length &&
        this.comparator(this.array[left], child) < 0
      )
        child = this.array[(down = left)];
      if (
        right < this.array.length &&
        this.comparator(this.array[right], child) < 0
      )
        child = this.array[(down = right)];
      if (down === i) break;
      this.array[(child.index = i)] = child;
      this.array[(object.index = i = down)] = object;
    }
  }
}

export default MinHeap;
