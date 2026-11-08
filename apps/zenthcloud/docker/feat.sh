


# BUILDER=$(docker buildx create --use)

# docker buildx build --platform linux/amd64,linux/arm64 --pull --rm -t "skygenesisenterprise/guilderia:feature" -f 'Dockerfile' --push .

docker build --platform linux/amd64 --pull --rm -t "skygenesisenterprise/guilderia:feature" -f 'Dockerfile' .

# docker  build --platform linux/amd64 --pull --rm -t "skygenesisenterprise/guilderia:feature" -f 'Dockerfile' .
