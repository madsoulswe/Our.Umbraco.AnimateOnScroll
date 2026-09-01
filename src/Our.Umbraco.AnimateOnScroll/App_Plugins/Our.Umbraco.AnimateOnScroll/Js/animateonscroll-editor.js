import { LitElement, css, html, nothing } from '@umbraco-cms/backoffice/external/lit';

const ANIMATIONS = [
    '', 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right',
    'fade-up-right', 'fade-up-left', 'fade-down-right', 'fade-down-left',
    'flip-up', 'flip-down', 'flip-left', 'flip-right',
    'slide-up', 'slide-down', 'slide-left', 'slide-right',
    'zoom-in', 'zoom-in-up', 'zoom-in-down', 'zoom-in-left', 'zoom-in-right',
    'zoom-out', 'zoom-out-up', 'zoom-out-down', 'zoom-out-left', 'zoom-out-right'
];

const EASINGS = [
    '', 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out',
    'ease-in-back', 'ease-out-back', 'ease-in-out-back',
    'ease-in-sine', 'ease-out-sine', 'ease-in-out-sine',
    'ease-in-quad', 'ease-out-quad', 'ease-in-out-quad',
    'ease-in-cubic', 'ease-out-cubic', 'ease-in-out-cubic',
    'ease-in-quart', 'ease-out-quart', 'ease-in-out-quart'
];

const ANCHORS = [
    '', 'top-bottom', 'top-center', 'top-top',
    'center-bottom', 'center-center', 'center-top',
    'bottom-bottom', 'bottom-center', 'bottom-top'
];

// The vendored AOS stylesheet is loaded inside the shadow root, so the demo
// box uses the exact same data-aos attributes and animations as the frontend.
const AOS_CSS_PATH = '/App_Plugins/Our.Umbraco.AnimateOnScroll/Vendor/aos/aos-2.3.4.css';

export class OurAnimateOnScrollPropertyEditorElement extends LitElement {

    static properties = {
        value: { type: Object },
        readonly: { type: Boolean },
        _edit: { state: true },
        _animate: { state: true },
        _animating: { state: true }
    };

    constructor() {
        super();
        this.value = undefined;
        this.readonly = false;
        this._edit = false;
        this._animate = false;
        this._animating = false;
        this._timeouts = [];
    }

    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        // Normalize a JSON-string value (e.g. legacy data) into an object.
        if (changedProperties.has('value') && typeof this.value === 'string') {
            try {
                this.value = this.value.trim() ? JSON.parse(this.value) : null;
            } catch {
                this.value = null;
            }
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._timeouts.forEach(clearTimeout);
        this._timeouts = [];
    }

    #dispatchChange() {
        this.dispatchEvent(new CustomEvent('property-value-change', { bubbles: false, composed: false }));
    }

    #setValue(partial) {
        this.value = { ...(this.value ?? {}), ...partial };
        this.#dispatchChange();
        this.#testAnimation();
    }

    #add() {
        this.value = { animation: 'fade', duration: 100 };
        this._edit = true;
        this.#dispatchChange();
    }

    #remove() {
        this.value = null;
        this._edit = false;
        this.#dispatchChange();
    }

    #canAnimate() {
        const v = this.value;
        return !!(v && v.animation && v.animation !== '' && v.duration && parseInt(v.duration, 10) > 0);
    }

    #testAnimation() {
        if (!this.#canAnimate() || this._animating) return;

        const duration = parseInt(this.value.duration, 10);
        this._animate = true;

        this._timeouts.push(setTimeout(() => {
            this._animating = true;

            this._timeouts.push(setTimeout(() => {
                this._animating = false;
                this._animate = false;
            }, duration));
        }, duration));
    }

    #onSelect(key, e) {
        this.#setValue({ [key]: e.target.value });
    }

    #onNumber(key, e) {
        const raw = e.target.value;
        this.#setValue({ [key]: raw === '' ? null : parseInt(raw, 10) });
    }

    #onToggle(key, e) {
        this.#setValue({ [key]: e.target.checked });
    }

    #renderSelect(label, key, options, description) {
        const current = this.value?.[key] ?? '';
        return html`
            <div class="control-group">
                <div class="control-header">
                    <label>${label}</label>
                    ${description ? html`<small>${description}</small>` : nothing}
                </div>
                <uui-select
                    label=${label}
                    ?disabled=${this.readonly}
                    .options=${options.map((o) => ({ name: o, value: o, selected: o === current }))}
                    @change=${(e) => this.#onSelect(key, e)}>
                </uui-select>
            </div>
        `;
    }

    #renderNumber(label, key, description, min, max) {
        return html`
            <div class="control-group">
                <div class="control-header">
                    <label>${label}</label>
                    ${description ? html`<small>${description}</small>` : nothing}
                </div>
                <uui-input
                    type="number"
                    label=${label}
                    step="1"
                    min=${min ?? nothing}
                    max=${max ?? nothing}
                    ?readonly=${this.readonly}
                    .value=${this.value?.[key] ?? ''}
                    @change=${(e) => this.#onNumber(key, e)}>
                </uui-input>
            </div>
        `;
    }

    #renderToggle(label, key, description) {
        return html`
            <label class="toggle-item" title=${description ?? nothing}>
                <uui-toggle
                    label=${label}
                    ?disabled=${this.readonly}
                    ?checked=${!!this.value?.[key]}
                    @change=${(e) => this.#onToggle(key, e)}>
                    ${label}
                </uui-toggle>
            </label>
        `;
    }

    #renderToggleButtons() {
        if (!this.value) {
            return html`
                <uui-button
                    look="primary"
                    color="positive"
                    label="Add animation"
                    ?disabled=${this.readonly}
                    @click=${this.#add}>
                    <uui-icon name="icon-add"></uui-icon> Add animation
                </uui-button>
            `;
        }

        if (!this._edit) {
            return html`
                <uui-button
                    look="primary"
                    label="Edit animation"
                    @click=${() => (this._edit = true)}>
                    Edit '${this.value.animation}' animation ${this.value.disabled ? '(disabled)' : ''}
                </uui-button>
            `;
        }

        return html`
            <uui-button look="primary" label="Close" @click=${() => (this._edit = false)}>Close</uui-button>
        `;
    }

    #renderDemo() {
        const v = this.value ?? {};
        const active = this.#canAnimate();

        return html`
            <div
                class="demo-box aos-init ${this._animating ? 'aos-animate' : ''} ${active ? '' : 'inactive'}"
                data-aos=${active && this._animate ? v.animation : ''}
                data-aos-duration=${v.duration ?? nothing}
                data-aos-delay=${v.delay ?? nothing}
                data-aos-easing=${v.easing || nothing}>
                <uui-icon name="icon-umbraco"></uui-icon>
            </div>
        `;
    }

    render() {
        return html`
            <link rel="stylesheet" href=${AOS_CSS_PATH} />
            <div class="toggle">${this.#renderToggleButtons()}</div>
            ${this.value && this._edit
                ? html`
                    <div class="animation-form">
                        <uui-box class="animation-settings" headline="Settings">
                            <div class="grid grid-2">
                                ${this.#renderSelect('Animation', 'animation', ANIMATIONS)}
                                ${this.#renderSelect('Easing', 'easing', EASINGS)}
                            </div>
                            ${this.#renderSelect('Anchor', 'anchor', ANCHORS, 'Defines which position of the element regarding to window should trigger the animation')}
                            <div class="grid grid-3">
                                ${this.#renderNumber('Duration (ms)', 'duration', '0 – 3000, step 50', 0, 3000)}
                                ${this.#renderNumber('Delay (ms)', 'delay', '0 – 3000, step 50', 0, 3000)}
                                ${this.#renderNumber('Offset (px)', 'offset', 'From trigger point')}
                            </div>
                            <div class="toggles">
                                ${this.#renderToggle('Mirror', 'mirror', 'Whether elements should animate out while scrolling past them')}
                                ${this.#renderToggle('Once', 'once', 'Whether animation should happen only once - while scrolling down')}
                                ${this.#renderToggle('Disabled', 'disabled')}
                            </div>

                            <hr />

                            <uui-button
                                class="w-100"
                                look="outline"
                                color="danger"
                                label="Remove animation"
                                ?disabled=${this.readonly}
                                @click=${this.#remove}>
                                <uui-icon name="icon-trash"></uui-icon> Remove animation
                            </uui-button>
                        </uui-box>

                        <uui-box class="animation-demo" headline="Preview">
                            <div class="demo-stage">${this.#renderDemo()}</div>
                            <uui-button
                                class="w-100"
                                look="secondary"
                                label="Replay animation"
                                ?disabled=${!this.#canAnimate()}
                                @click=${this.#testAnimation}>
                                <uui-icon name="icon-refresh"></uui-icon> Replay animation
                            </uui-button>
                        </uui-box>
                    </div>`
                : nothing}
        `;
    }

    static styles = css`
        :host {
            display: block;
            --uui-box-default-padding: 18px;
        }

        .animation-form {
            display: flex;
            gap: var(--uui-size-space-5, 18px);
            margin-top: var(--uui-size-space-4, 12px);
        }

        .animation-settings,
        .animation-demo {
            flex: 1 1 50%;
        }

        .grid {
            display: grid;
            gap: var(--uui-size-space-4, 12px);
        }

        .grid-2 { grid-template-columns: 1fr 1fr; }
        .grid-3 { grid-template-columns: 1fr 1fr 1fr; }

        .toggles {
            display: flex;
            gap: var(--uui-size-space-3, 9px);
            flex-wrap: wrap;
        }

        .toggle-item {
            display: flex;
            align-items: center;
            padding: var(--uui-size-space-2, 6px) var(--uui-size-space-4, 12px);
            border: 1px solid var(--uui-color-border, #d8d7d9);
            border-radius: var(--uui-border-radius, 3px);
            cursor: pointer;
        }

        .control-group {
            margin-bottom: var(--uui-size-space-4, 12px);
            display: flex;
            flex-direction: column;
        }

        .control-group uui-input,
        .control-group uui-select {
            width: 100%;
        }

        .control-header label {
            display: block;
            font-weight: bold;
        }

        .control-header small {
            display: block;
            color: var(--uui-color-text-alt, #68676b);
            margin-bottom: 4px;
        }

        .w-100 {
            width: 100%;
        }

        hr {
            border: none;
            border-top: 1px solid var(--uui-color-divider, #e9e9eb);
            margin: var(--uui-size-space-4, 12px) 0;
        }

        /* Demo box base styling; the animations themselves come from the AOS
           stylesheet linked in the shadow root (data-aos attributes). */
        .demo-stage {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 260px;
            height: calc(100% - 50px);
            margin-bottom: var(--uui-size-space-4, 12px);
            border-radius: var(--uui-border-radius, 3px);
            background-color: var(--uui-color-surface-alt, #f4f4f4);
            background-image: radial-gradient(var(--uui-color-border, #d8d7d9) 1px, transparent 1px);
            background-size: 16px 16px;
            overflow: hidden;
        }

        .demo-box {
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--uui-color-default, #1b264f);
            color: #fff;
            border-radius: 3px;
            font-size: 40px;
            pointer-events: none;
        }

        .demo-box.inactive {
            opacity: 0.25;
        }
    `;
}

customElements.define('our-animateonscroll-property-editor', OurAnimateOnScrollPropertyEditorElement);

export default OurAnimateOnScrollPropertyEditorElement;
