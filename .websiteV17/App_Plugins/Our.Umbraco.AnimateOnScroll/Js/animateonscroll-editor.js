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
                    class="input-number"
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
            <div class="control-group">
                <div class="control-header">
                    <label>${label}</label>
                    ${description ? html`<small>${description}</small>` : nothing}
                </div>
                <uui-toggle
                    label=${label}
                    ?disabled=${this.readonly}
                    ?checked=${!!this.value?.[key]}
                    @change=${(e) => this.#onToggle(key, e)}>
                </uui-toggle>
            </div>
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
        if (!this.#canAnimate()) return nothing;

        const v = this.value;

        return html`
            <div
                class="demo-box aos-init ${this._animating ? 'aos-animate' : ''}"
                data-aos=${this._animate ? v.animation : ''}
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
                        <uui-box class="animation-settings">
                            ${this.#renderSelect('Animation', 'animation', ANIMATIONS)}
                            ${this.#renderSelect('Easing', 'easing', EASINGS)}
                            ${this.#renderSelect('Anchor', 'anchor', ANCHORS, 'Defines which position of the element regarding to window should trigger the animation')}
                            ${this.#renderNumber('Duration', 'duration', 'Values from 0 to 3000, with step 50ms', 0, 3000)}
                            ${this.#renderNumber('Delay', 'delay', 'Values from 0 to 3000, with step 50ms', 0, 3000)}
                            ${this.#renderNumber('Offset', 'offset', 'Offset (in px) from the original trigger point')}
                            ${this.#renderToggle('Mirror', 'mirror', 'Whether elements should animate out while scrolling past them')}
                            ${this.#renderToggle('Once', 'once', 'Whether animation should happen only once - while scrolling down')}
                            ${this.#renderToggle('Disabled', 'disabled')}

                            ${this.#canAnimate()
                                ? html`
                                    <uui-button
                                        class="w-100"
                                        look="secondary"
                                        label="Test animation"
                                        @click=${this.#testAnimation}>
                                        Test animation
                                    </uui-button>`
                                : nothing}

                            <hr />

                            <uui-button
                                class="w-100"
                                look="primary"
                                color="danger"
                                label="Remove animation"
                                ?disabled=${this.readonly}
                                @click=${this.#remove}>
                                <uui-icon name="icon-trash"></uui-icon> Remove animation
                            </uui-button>
                        </uui-box>

                        <uui-box class="animation-demo">${this.#renderDemo()}</uui-box>
                    </div>`
                : nothing}
        `;
    }

    static styles = css`
        :host {
            display: block;
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

        .animation-demo {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .control-group {
            margin-bottom: var(--uui-size-space-4, 12px);
            display: flex;
            flex-direction: column;
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

        .input-number {
            width: 120px;
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
    `;
}

customElements.define('our-animateonscroll-property-editor', OurAnimateOnScrollPropertyEditorElement);

export default OurAnimateOnScrollPropertyEditorElement;
