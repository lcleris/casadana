import EnglishFlag from "@/assets/shared/english.png"
import FrenchFlag from "@/assets/shared/french.png"
import SpanishFlag from "@/assets/shared/spain.png"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getLocale, setLocale, type Locale } from "@/paraglide/runtime"

const LANGUAGES = {
  en: "EN",
  fr: "FR",
  es: "ES",
} satisfies Record<Locale, string>

const availableLanguages = {
  en: EnglishFlag,
  es: SpanishFlag,
  fr: FrenchFlag,
} satisfies Record<Locale, string>

export function LangSelector() {
  const language = getLocale()

  return (
    <Select value={language} onValueChange={(lang) => setLocale(lang!)}>
      <SelectTrigger className="w-fit border-none">
        <SelectValue>
          <img src={availableLanguages[language]} alt={language} className="h-6 w-8" />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="border-none bg-white/30 backdrop-blur-2xl">
        <SelectGroup>
          {(Object.keys(availableLanguages) as Array<Locale>).map((lang) => (
            <SelectItem key={lang} className="flex items-center space-x-2" value={lang}>
              <img src={availableLanguages[lang]} alt={LANGUAGES[lang]} className="h-6 w-8" />
              <span>{LANGUAGES[lang]}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
