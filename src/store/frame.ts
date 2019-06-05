interface Item {
  files: string[]
}

const items: Item[] = [
  {
    files: ['frame_1_1.png', 'frame_1_2.png', 'frame_1_3.png']
    // position: [0, 0],
    // size: ['auto', '100%']
  },
  {
    files: ['frame_2_1.png', 'frame_2_2.png', 'frame_2_3.png']
    // position: ['50%', '50%'],
    // size: ['100%', '100%']
  },
  {
    files: ['frame_3_1.png', 'frame_3_2.png', 'frame_3_3.png']
    // position: [0, '100%'],
    // size: ['100%', '50%']
  }
]

export const getters = {
  items(): Item[] {
    return items
  }
}
