import { Heading, HStack, Image, Stack, Text } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

export const HomePageHero: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <Stack>
      <HStack>
        <Stack spacing={0} minW={32}>
          <Image alt={"Flitz"} mx={"auto"} w={40} src={"/icon.png"} />
        </Stack>
        <Stack spacing={2}>
          <Heading size={"md"}>{t("Hello,world!")}</Heading>
          <Text>
            {t(
              "This is the microblogging community. Publish anything you want: text, links, picture."
            )}
          </Text>
        </Stack>
      </HStack>
    </Stack>
  )
}
