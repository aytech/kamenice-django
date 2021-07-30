interface Props {
  colors: string[]
  getRandomColor: () => string
}

export const Colors: Props = {
  colors: [
    "#f5222d", // red
    "#fa541c", // volcano
    "#fa8c16", // orange
    "#faad14", // gold
    "#fadb14", // yellow
    "#a0d911", // lime
    "#52c41a", // green
    "#13c2c2", // cyan
    "#1890ff", // blue
    "#2f54eb", // geekblue
    "#722ed1", // purple
    "#eb2f96", // magenta
  ],
  getRandomColor: () => {
    return Colors.colors[ Math.floor(Math.random() * Colors.colors.length) ]
  }
}