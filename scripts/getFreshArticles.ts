import Parser from 'rss-parser/dist/rss-parser.min.js'
import { extFetch } from '../extFetch'
import { ContentProvidersResponse } from '../pocketbase-types'
import { dismissUsedArticles } from '../utils/freshArticles'
import { Article } from '../types/article'
import { assert } from '../utils/assert'

export async function getFreshArticles(provider: ContentProvidersResponse) {
    const text = await getResponseFromProvider(provider)

    const parser: Parser = new Parser()
    const { items } = await parser.parseString(text)

    const articlesFromProvider = items.map(createArticleRecordFromItem)
    const freshArticles = dismissUsedArticles(articlesFromProvider)

    return freshArticles
}

async function getResponseFromProvider(provider: ContentProvidersResponse) {
    if (import.meta.env.VITE_MOCK_RSS_REQUEST) {
        console.info(`RSS request for ${provider.url} is mocked`)

        if (import.meta.env.VITE_FASTMOCK) {
            await new Promise((resolve) => setTimeout(resolve, 100))
        } else {
            await new Promise((resolve) =>
                setTimeout(resolve, 1000 * Math.random())
            )
        }

        return MOCK_RESPONSE
    }

    const response = await extFetch(provider.url)
    const encoding = provider.encoding

    const text = encoding
        ? await decode(response, encoding)
        : await response.text()

    return text
}

async function decode(response: Response, encoding: string) {
    const decoder = new TextDecoder(encoding)
    const text = decoder.decode(await response.arrayBuffer())

    return text
}

function createArticleRecordFromItem(item: Parser.Item): Article {
    const link = item.link || item.guid
    const content = (item.summary ||
        item.content ||
        item.contentSnippet ||
        ('content:encodedSnippet' in item &&
            item['content:encodedSnippet'])) as string

    const date = item.isoDate as string

    assert(link)
    assert(item.title)

    return {
        title: item.title,
        link,
        content,
        date: new Date(date),
    }
}

const MOCK_RESPONSE = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
        <channel>
            <title><![CDATA[전체기사 : 뉴스 : 한겨레 뉴스 - 인터넷한겨레]]></title>
            <description><![CDATA[인터넷한겨레 - 토론이 살아 있는 생생한 인터넷뉴스]]></description>
            <link>https://www.hani.co.kr</link>
            <generator>RSS for Node</generator>
            <lastBuildDate>Wed, 15 May 2024 09:33:33 GMT</lastBuildDate>
            <copyright><![CDATA[Copyright The Hankyoreh.]]></copyright>
            <dc:language>ko</dc:language>
            <item>
                <title><![CDATA[풀빌라에서 실종된 6살, 인근 저수지서 숨진 채 발견]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502365.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/area/yeongnam/1140704.html</link>
                <guid isPermaLink="false">1140704</guid>
                <dc:subject>풀빌라에서 실종된 6살, 인근 저수지서 숨진 채 발견</dc:subject>
                <dc:category>영남</dc:category>
            </item>
            <item>
                <title><![CDATA[살아 숨 쉬는 존재들의 이야기 [똑똑! 한국사회]]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502360.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/column/1140703.html</link>
                <guid isPermaLink="false">1140703</guid>
                <dc:subject>살아 숨 쉬는 존재들의 이야기 [똑똑! 한국사회]</dc:subject>
                <dc:category>칼럼</dc:category>
            </item>
            <item>
                <title><![CDATA[비데장관, 와인장관 그리고 ‘피지워터 수석’ [뉴스룸에서]]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502358.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/column/1140702.html</link>
                <guid isPermaLink="false">1140702</guid>
                <dc:subject>비데장관, 와인장관 그리고 ‘피지워터 수석’ [뉴스룸에서]</dc:subject>
                <dc:category>칼럼</dc:category>
            </item>
            <item>
                <title><![CDATA[전시가 끝나고 나면 [크리틱]]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502351.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/column/1140701.html</link>
                <guid isPermaLink="false">1140701</guid>
                <dc:subject>전시가 끝나고 나면 [크리틱]</dc:subject>
                <dc:category>칼럼</dc:category>
            </item>
            <item>
                <title><![CDATA[아픈 역사 담긴 ‘성병관리소’…동두천시 철거계획 중단해야 [왜냐면]]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502347.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/because/1140700.html</link>
                <guid isPermaLink="false">1140700</guid>
                <dc:subject>아픈 역사 담긴 ‘성병관리소’…동두천시 철거계획 중단해야 [왜냐면]</dc:subject>
                <dc:category>왜냐면</dc:category>
            </item>
            <item>
                <title><![CDATA[위헌 공방으로 번진 ‘전국민 25만원’…민생 골든타임 놓칠라]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502341.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/economy/economy_general/1140699.html</link>
                <guid isPermaLink="false">1140699</guid>
                <dc:subject>위헌 공방으로 번진 ‘전국민 25만원’…민생 골든타임 놓칠라</dc:subject>
                <dc:category>경제일반</dc:category>
            </item>
            <item>
                <title><![CDATA[[사설] 민생토론회 재개 윤 대통령, 야당 협조 얻을 방안 있나]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502343.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/editorial/1140698.html</link>
                <guid isPermaLink="false">1140698</guid>
                <dc:subject>[사설] 민생토론회 재개 윤 대통령, 야당 협조 얻을 방안 있나</dc:subject>
                <dc:category>사설</dc:category>
            </item>
            <item>
                <title><![CDATA[윤정부의 진짜 목적은 연금개혁 아니라 ‘연금 약화’였나 [왜냐면]]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502338.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/because/1140697.html</link>
                <guid isPermaLink="false">1140697</guid>
                <dc:subject>윤정부의 진짜 목적은 연금개혁 아니라 ‘연금 약화’였나 [왜냐면]</dc:subject>
                <dc:category>왜냐면</dc:category>
            </item>
            <item>
                <title><![CDATA[제천시가 고려인 이주·정착에 주목하는 이유 [왜냐면]]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502334.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/because/1140696.html</link>
                <guid isPermaLink="false">1140696</guid>
                <dc:subject>제천시가 고려인 이주·정착에 주목하는 이유 [왜냐면]</dc:subject>
                <dc:category>왜냐면</dc:category>
            </item>
            <item>
                <title><![CDATA[자전거로 탄소중립한 만큼 보상하는 정책 참신하다 [왜냐면]]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502330.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/because/1140695.html</link>
                <guid isPermaLink="false">1140695</guid>
                <dc:subject>자전거로 탄소중립한 만큼 보상하는 정책 참신하다 [왜냐면]</dc:subject>
                <dc:category>왜냐면</dc:category>
            </item>
            <item>
                <title><![CDATA[언제까지? [옵스큐라]]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502326.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/column/1140694.html</link>
                <guid isPermaLink="false">1140694</guid>
                <dc:subject>언제까지? [옵스큐라]</dc:subject>
                <dc:category>칼럼</dc:category>
            </item>
            <item>
                <title><![CDATA[파도소리? 빠도소리?…외국인 받아쓰기 대회 [포토]]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157649870113_20240515502321.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/society/schooling/1140693.html</link>
                <guid isPermaLink="false">1140693</guid>
                <dc:subject>파도소리? 빠도소리?…외국인 받아쓰기 대회 [포토]</dc:subject>
                <dc:category>교육</dc:category>
            </item>
            <item>
                <title><![CDATA[나성범, 홈런 포함 4타점 경기…KIA, 두산 10연승 저지]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502310.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/sports/baseball/1140692.html</link>
                <guid isPermaLink="false">1140692</guid>
                <dc:subject>나성범, 홈런 포함 4타점 경기…KIA, 두산 10연승 저지</dc:subject>
                <dc:category>야구·MLB</dc:category>
            </item>
            <item>
                <title><![CDATA[정부, ‘액상형 담배’ 규제법 개정 착수…과세 수준이 쟁점]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502308.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/economy/economy_general/1140691.html</link>
                <guid isPermaLink="false">1140691</guid>
                <dc:subject>정부, ‘액상형 담배’ 규제법 개정 착수…과세 수준이 쟁점</dc:subject>
                <dc:category>경제일반</dc:category>
            </item>
            <item>
                <title><![CDATA[[사설] 끝내 사익편취 규제 피해간 쿠팡, 모니터링은 더 강화해야]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502304.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/editorial/1140690.html</link>
                <guid isPermaLink="false">1140690</guid>
                <dc:subject>[사설] 끝내 사익편취 규제 피해간 쿠팡, 모니터링은 더 강화해야</dc:subject>
                <dc:category>사설</dc:category>
            </item>
            <item>
                <title><![CDATA[[사설] 채 상병 수사 외압도 갈수록 뚜렷, 더 이상 ‘방탄’ 안 된다]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502299.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/editorial/1140689.html</link>
                <guid isPermaLink="false">1140689</guid>
                <dc:subject>[사설] 채 상병 수사 외압도 갈수록 뚜렷, 더 이상 ‘방탄’ 안 된다</dc:subject>
                <dc:category>사설</dc:category>
            </item>
            <item>
                <title><![CDATA[현대글로비스, 제주도에서 전기차 폐배터리 사업 나선다]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502291.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/economy/marketing/1140688.html</link>
                <guid isPermaLink="false">1140688</guid>
                <dc:subject>현대글로비스, 제주도에서 전기차 폐배터리 사업 나선다</dc:subject>
                <dc:category>산업·재계</dc:category>
            </item>
            <item>
                <title><![CDATA[자본연 “상장기업, 신탁 통해 자사주 취득시 공시 강화해야”]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2024/0515/20240515502289.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/economy/finance/1140687.html</link>
                <guid isPermaLink="false">1140687</guid>
                <dc:subject>자본연 “상장기업, 신탁 통해 자사주 취득시 공시 강화해야”</dc:subject>
                <dc:category>금융·증권</dc:category>
            </item>
            <item>
                <title><![CDATA[라인 한국법인 2500명 일자리 불안 떤다…일 CEO “고용 보장 약속”]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157651161456_20240515502283.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/economy/it/1140686.html</link>
                <guid isPermaLink="false">1140686</guid>
                <dc:subject>라인 한국법인 2500명 일자리 불안 떤다…일 CEO “고용 보장 약속”</dc:subject>
                <dc:category>IT</dc:category>
            </item>
            <item>
                <title><![CDATA[맨주먹으로 악어 코 때렸다…쌍둥이 자매 구한 영국 여성, 왕실 훈장]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157640542907_20240515502277.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/international/international_general/1140685.html</link>
                <guid isPermaLink="false">1140685</guid>
                <dc:subject>맨주먹으로 악어 코 때렸다…쌍둥이 자매 구한 영국 여성, 왕실 훈장</dc:subject>
                <dc:category>국제일반</dc:category>
            </item>
            <item>
                <title><![CDATA[강백호는 매섭고 원태인은 눈부시다…불붙기 시작한 개인 타이틀 경쟁]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157637668946_20240515502263.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/sports/baseball/1140684.html</link>
                <guid isPermaLink="false">1140684</guid>
                <dc:subject>강백호는 매섭고 원태인은 눈부시다…불붙기 시작한 개인 타이틀 경쟁</dc:subject>
                <dc:category>야구·MLB</dc:category>
            </item>
            <item>
                <title><![CDATA[‘명심’ 실린 추미애 의장 후보…“이 대표가 좌지우지” 비판도]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157641560649_20240515502257.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/politics/politics_general/1140683.html</link>
                <guid isPermaLink="false">1140683</guid>
                <dc:subject>‘명심’ 실린 추미애 의장 후보…“이 대표가 좌지우지” 비판도</dc:subject>
                <dc:category>정치일반</dc:category>
            </item>
            <item>
                <title><![CDATA[발달장애 작가 초대전 ‘멋진어색함’…31일까지 국립정신건강센터 갤러리M]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157631527463_20240515502226.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/culture/music/1140682.html</link>
                <guid isPermaLink="false">1140682</guid>
                <dc:subject>발달장애 작가 초대전 ‘멋진어색함’…31일까지 국립정신건강센터 갤러리M</dc:subject>
                <dc:category>음악·공연·전시</dc:category>
            </item>
            <item>
                <title><![CDATA[“아무것도 몰랐다” 부인했지만…타이 ‘한국인 납치살해’ 20대 구속]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157622321415_20240515502184.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/area/yeongnam/1140681.html</link>
                <guid isPermaLink="false">1140681</guid>
                <dc:subject>“아무것도 몰랐다” 부인했지만…타이 ‘한국인 납치살해’ 20대 구속</dc:subject>
                <dc:category>영남</dc:category>
            </item>
            <item>
                <title><![CDATA[방시혁 재벌 총수 지정…하이브·영원그룹 등 대기업집단 합류]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/original/2023/0315/20230315502042.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/economy/economy_general/1140680.html</link>
                <guid isPermaLink="false">1140680</guid>
                <dc:subject>방시혁 재벌 총수 지정…하이브·영원그룹 등 대기업집단 합류</dc:subject>
                <dc:category>경제일반</dc:category>
            </item>
            <item>
                <title><![CDATA[조지아, 러시아식 ‘언론·시민단체 통제법’ 통과…미 “관계 재고”]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157622969572_20240515502153.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/international/international_general/1140679.html</link>
                <guid isPermaLink="false">1140679</guid>
                <dc:subject>조지아, 러시아식 ‘언론·시민단체 통제법’ 통과…미 “관계 재고”</dc:subject>
                <dc:category>국제일반</dc:category>
            </item>
            <item>
                <title><![CDATA[“미국 정부, 이스라엘에 1조원 규모 무기 판매 계획” 보도 나와]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157618847657_20240515502132.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/international/arabafrica/1140678.html</link>
                <guid isPermaLink="false">1140678</guid>
                <dc:subject>“미국 정부, 이스라엘에 1조원 규모 무기 판매 계획” 보도 나와</dc:subject>
                <dc:category>중동·아프리카</dc:category>
            </item>
            <item>
                <title><![CDATA[어린이 스포츠대회서 심판이 동료에 흉기 휘둘러]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157614477427_20240515502124.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/area/capital/1140677.html</link>
                <guid isPermaLink="false">1140677</guid>
                <dc:subject>어린이 스포츠대회서 심판이 동료에 흉기 휘둘러</dc:subject>
                <dc:category>수도권</dc:category>
            </item>
            <item>
                <title><![CDATA[윤 대통령은 눈치를 안 보나 못 보나 [권태호 칼럼]]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/child/2024/0515/53_17157609810979_20240515502100.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/opinion/column/1140676.html</link>
                <guid isPermaLink="false">1140676</guid>
                <dc:subject>윤 대통령은 눈치를 안 보나 못 보나 [권태호 칼럼]</dc:subject>
                <dc:category>칼럼</dc:category>
            </item>
            <item>
                <title><![CDATA[삼성자산보다 0.0001% 낮춘 미래에셋…ETF 운용보수 인하 경쟁]]></title>
                <description><![CDATA[<table border='0px' cellpadding='0px' cellspacing='0px' width='107px'><tr><td bgcolor='#DDDDDD' style='padding: 1px;'><table border='0px' cellpadding='0px' cellspacing='0px' width='105px' height='84px'><tr><td bgcolor='#FFFFFF' style='padding: 3px;' align=center><img src=https://flexible.img.hani.co.kr/flexible/normal/300/180/imgdb/resize/test/child/2024/0515/53_17157610318815_20240515502104.jpg border=0></td></tr></table></td><td width='13px' nowrap></td></tr></table>]]></description>
                <link>https://www.hani.co.kr/arti/economy/finance/1140675.html</link>
                <guid isPermaLink="false">1140675</guid>
                <dc:subject>삼성자산보다 0.0001% 낮춘 미래에셋…ETF 운용보수 인하 경쟁</dc:subject>
                <dc:category>금융·증권</dc:category>
            </item>
        </channel>
    </rss>`
