export class GradualRenderer {
    renderQueue: string[] = []
    partElement: HTMLElement | null = null

    private flushing = false

    constructor(private articleElement: HTMLElement) {}

    render(content: string) {
        for (const char of content) {
            this.renderChar(char)
        }
    }

    private renderChar(content: string) {
        this.renderQueue.push(content)

        if (!this.flushing) {
            this.flush()
        }
    }

    private async flush() {
        this.flushing = true

        while (true) {
            const content = this.renderQueue.shift()

            if (content === undefined) {
                console.log(this.renderQueue.length)
                break
            }

            if (this.partElement && content === '\n') {
                this.partElement = null

                continue
            }

            if (content === '#') {
                this.partElement = document.createElement('h2')
                this.articleElement.appendChild(this.partElement)
                continue
            }

            if (content === '[') {
                this.partElement = document.createElement('a')
                const wrapper = document.createElement('p')
                wrapper.appendChild(this.partElement)
                this.articleElement.appendChild(wrapper)
                continue
            }

            if (
                content === ')' &&
                this.partElement instanceof HTMLAnchorElement
            ) {
                const linkContent = this.partElement.textContent
                const [text, url] = linkContent!.split('](')

                this.partElement.textContent = text
                this.partElement.href = url

                this.partElement = null
                continue
            }

            if (!this.partElement) {
                this.partElement = document.createElement('p')
                this.articleElement.appendChild(this.partElement)
            }

            const span = document.createElement('span')
            span.appendChild(document.createTextNode(content))
            span.classList.add('appear')

            this.partElement.appendChild(span)
            await new Promise((resolve) => setTimeout(resolve, 1))
        }

        this.flushing = false
    }
}
