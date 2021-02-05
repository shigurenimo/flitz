import {
  Box,
  Button,
  Code,
  Heading,
  Image,
  Link as LinkText,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react"
import { StackHeader } from "app/core/components/StackHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Link } from "blitz"
import React from "react"
import { useTranslation } from "react-i18next"

const AboutPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />}>
      <StackHeader>{"FLITZ"}</StackHeader>
      <Stack direction={{ base: "column", md: "row" }} spacing={8} px={4}>
        <Box
          minW={32}
          borderWidth={1}
          overflow={"hidden"}
          rounded={"md"}
          bg={"white"}
        >
          <Image
            alt={"FLITZ"}
            mx={"auto"}
            w={40}
            src={"/apple-touch-icon.png"}
          />
        </Box>
        <Stack spacing={4}>
          <Stack>
            <Heading size={"lg"}>{t("The Feed App Boilerplate")}</Heading>
            <Heading size={"md"}>
              {t("built on ")}
              <LinkText href={"https://blitzjs.com/"} isExternal>
                {t("Blitz.js.")}
              </LinkText>
            </Heading>
          </Stack>
          <Box>
            <Link href={"https://github.com/swimmy/flitz"} passHref>
              <Button letterSpacing={"wider"} colorScheme={"blue"}>
                {"Swimmy/Flitz"}
              </Button>
            </Link>
          </Box>
        </Stack>
      </Stack>
      <Stack spacing={8} px={4}>
        <Heading>{"Clone a repository"}</Heading>
        <Stack>
          <Text>{"Close a repository by using GitHub CLI"}</Text>
          <Box>
            <Code p={4} w={"full"} rounded={"md"}>
              {"% gh repo clone swimmy/flitz"}
            </Code>
          </Box>
        </Stack>
        <Stack>
          <Text>{"Or GitHub Desktop"}</Text>
          <Box>
            <Link
              href={
                "x-github-client://openRepo/https://github.com/swimmy/flitz"
              }
              passHref
            >
              <Button letterSpacing={"wider"} colorScheme={"blue"}>
                {"Open with GitHub Desktop"}
              </Button>
            </Link>
          </Box>
        </Stack>
      </Stack>
      <Stack spacing={8} px={4}>
        <Heading>{"Getting Started"}</Heading>
        <Stack>
          <Text>{"Run PostgreSQL by using Docker."}</Text>
          <Box>
            <Code p={4} w={"full"} rounded={"md"}>
              {"% docker-compose up -d"}
            </Code>
          </Box>
          <Box>
            <LinkText href={"https://blitzjs.com/docs/postgres"} isExternal>
              {"→ Run Postgres Locally - Blitz.js"}
            </LinkText>
          </Box>
        </Stack>
        <Stack>
          <Text>{"Install Node.js modules."}</Text>
          <Box>
            <Code p={4} w={"full"} rounded={"md"}>
              {"% yarn"}
            </Code>
          </Box>
        </Stack>
        <Stack>
          <Text>{"Migrate PostgreSQL schemas."}</Text>
          <Box>
            <Code p={4} w={"full"} rounded={"md"}>
              {"% yarn prisma db push --preview-feature"}
            </Code>
          </Box>
        </Stack>
        <Stack>
          <Text>{"Run your app in the development mode."}</Text>
          <Box>
            <Code p={4} w={"full"} rounded={"md"}>
              {"% yarn start"}
            </Code>
          </Box>
        </Stack>
      </Stack>
    </StackMain>
  )
}

AboutPage.getLayout = (page) => {
  return <Layout title={"About Flitz"}>{page}</Layout>
}

export default AboutPage
