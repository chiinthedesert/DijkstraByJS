/**
 * MinHeap trong JavaScript, sử dụng một mảng để lưu trữ phần tử và một hàm so sánh
 * tùy chỉnh để xác định thứ tự của phần tử.
 * MinHeap hỗ trợ các phương thức push (thêm phần tử), pop (lấy phần tử nhỏ nhất), và size (kiểm tra số lượng phần tử).
 * Các phương thức bubbleUp và sinkDown được sử dụng để duy trì tính chất của MinHeap sau khi thêm hoặc loại bỏ phần tử.
 *
 */
export class MinHeap {
  /**
   * Tạo một MinHeap mới với một hàm so sánh tùy chỉnh (mặc định là so sánh số)
   * @param {(a:any, b:any)=> number} comparator - Hàm so sánh để xác định thứ tự của phần tử trong MinHeap.
   * Nó nhận hai phần tử và trả về một số âm nếu a < b, 0 nếu a == b, và một số dương nếu a > b.
   */
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  /**
   * Thêm một phần tử vào MinHeap
   * @param {*} value - Phần tử cần thêm vào MinHeap
   */
  push(value) {
    this.heap.push(value);
    this.bubbleUp();
  }

  /**
   * Lấy phần tử nhỏ nhất từ MinHeap và loại bỏ nó khỏi MinHeap
   * @returns {*} - Phần tử nhỏ nhất trong MinHeap, hoặc null nếu MinHeap rỗng
   */
  pop() {
    if (this.size() === 0) return null;
    if (this.size() === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.sinkDown();
    return top;
  }

  /**
   * Kiểm tra số lượng phần tử trong MinHeap
   * @returns {number} - Số lượng phần tử trong MinHeap
   */
  size() {
    return this.heap.length;
  }

  /**
   * Di chuyển phần tử mới thêm vào vị trí đúng trong MinHeap để duy trì tính chất của MinHeap
   */
  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parentIndex]) >= 0) break;
      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];
      index = parentIndex;
    }
  }

  /**
   * Di chuyển phần tử ở vị trí gốc xuống vị trí đúng trong MinHeap để duy trì tính chất của MinHeap sau khi loại bỏ phần tử nhỏ nhất
   */
  sinkDown() {
    let index = 0;
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let swap = null;

      if (left < length) {
        if (this.comparator(this.heap[left], this.heap[index]) < 0) swap = left;
      }

      if (right < length) {
        if (
          (swap === null &&
            this.comparator(this.heap[right], this.heap[index]) < 0) ||
          (swap !== null &&
            this.comparator(this.heap[right], this.heap[left]) < 0)
        ) {
          swap = right;
        }
      }

      if (swap === null) break;
      [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
      index = swap;
    }
  }
}
