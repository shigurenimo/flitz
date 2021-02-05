import { useObjectURL } from "app/core/hooks/useObjectURL"
import { FunctionComponent } from "react"

export const RenderFileLoader: FunctionComponent<{
  file: File
  render(url?: string): React.ReactElement
}> = ({ file, render }) => {
  const url = useObjectURL(file)

  return render(url)
}
