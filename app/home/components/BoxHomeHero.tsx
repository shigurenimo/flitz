import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react"
import { FC } from "react"
import { useTranslation } from "react-i18next"

export const BoxHomeHero: FC = () => {
  const { t } = useTranslation()

  return (
    <Stack px={4} direction={{ base: "column", lg: "row" }} spacing={4}>
      <Box
        w={"full"}
        minW={32}
        borderWidth={1}
        overflow={"hidden"}
        rounded={"md"}
        bg={"white"}
      >
        <Image alt={"FLITZ"} mx={"auto"} w={40} src={"/apple-touch-icon.png"} />
      </Box>
      <Stack spacing={2}>
        <Heading size={"md"}>{t("Hello,world!")}</Heading>
        <Text>
          {t(
            "This is the microblogging community. Publish anything you want: text, links, picture."
          )}
        </Text>
      </Stack>
    </Stack>
  )
}
