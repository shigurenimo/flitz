import { useObjectURL } from "app/core/hooks/useObjectURL"
import { VFC } from "react"

type Props = {
  file: File
  render(url?: string): React.ReactElement
}

export const RenderFileLoader: VFC<Props> = (props) => {
  const url = useObjectURL(props.file)

  return props.render(url)
}
