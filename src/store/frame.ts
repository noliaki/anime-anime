interface Item {
  files: string[]
}

const items: Item[] = [
  {
    files: ['frame_1_1.png', 'frame_1_2.png', 'frame_1_3.png']
  },
  {
    files: ['frame_2_1.png', 'frame_2_2.png', 'frame_2_3.png']
  },
  {
    files: ['frame_3_1.png', 'frame_3_2.png', 'frame_3_3.png']
  },
  {
    files: ['frame_4_1.png', 'frame_4_2.png', 'frame_4_3.png']
  },
  {
    files: ['frame_5_1.png', 'frame_5_2.png', 'frame_5_3.png']
  }
]

export const getters = {
  items(): Item[] {
    return items
  }
}
