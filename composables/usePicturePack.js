// composables/usePicturePack.js
import { computed } from 'vue'
import pictureWordsByTopic from '~/data/pictureWords.json'

export const usePicturePack = () => {
    const wordImages = import.meta.glob(
        '~/assets/images/word-card-images/**/*.svg',
        {
            eager: true,
            import: 'default',
        }
    )

    const normalizeTopic = (folder) => {
        if (!folder) return 'Home'

        const map = {
            body: 'Body',
            clothes: 'Clothes',
            colors: 'Colors',
            food: 'Food',
            home: 'Home',
            nature: 'Nature',
            professions: 'Professions',
            sport: 'Sport',
            tools: 'Tools',
            transport: 'Transport',
            other: 'Other',
            'city and school': 'City',
            animals: 'Animals',
        }

        return map[folder.toLowerCase()] || folder
    }

    const parsePath = (path) => {
        const parts = path.split('/')
        const fileName = parts[parts.length - 1]
        const folderName = parts[parts.length - 2]
        const imageKey = fileName.replace('.svg', '')

        return {
            imageKey,
            folderTopic: normalizeTopic(folderName),
        }
    }

    const getWordImageUrl = (imageKey) => {
        if (!imageKey) return ''

        const file = imageKey.endsWith('.svg')
            ? imageKey
            : `${imageKey}.svg`

        const path = Object.keys(wordImages).find((p) =>
            p.endsWith(`/${file}`)
        )

        return path ? wordImages[path] : ''
    }

    const flattenTranslations = (data) => {
        const flatMap = {}

        Object.entries(data).forEach(([topic, words]) => {
            Object.entries(words).forEach(([imageKey, value]) => {
                flatMap[imageKey] = {
                    ...value,
                    topic,
                }
            })
        })

        return flatMap
    }

    const translationsMap = flattenTranslations(pictureWordsByTopic)

    const parsed = Object.keys(wordImages).map(parsePath)

    const availableImageKeys = parsed
        .map((i) => i.imageKey)
        .sort()

    const picturePack = parsed
        .map(({ imageKey, folderTopic }) => {
            const tr = translationsMap[imageKey] || null

            return {
                id: `pic-${imageKey}`,
                type: 'picture',

                imageKey,
                topic: tr?.topic || folderTopic,

                ruWord: tr?.ru || '',
                deWord: tr?.de || '',
                level: tr?.level ?? 1,

                isReady: !!(tr?.ru && tr?.de),
            }
        })
        .sort(
            (a, b) =>
                a.topic.localeCompare(b.topic) ||
                a.imageKey.localeCompare(b.imageKey)
        )

    const missingTranslations = computed(() =>
        picturePack
            .filter((c) => !c.isReady)
            .map((c) => c.imageKey)
    )

    return {
        picturePack,
        availableImageKeys,
        getWordImageUrl,
        missingTranslations,
    }
}