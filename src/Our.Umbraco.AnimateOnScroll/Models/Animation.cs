using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

#if NET472
#elif NET5_0
using Microsoft.AspNetCore.Html;
#endif

namespace Our.Umbraco.AnimateOnScroll.Models
{
    public class Animation
    {
        [JsonProperty("animation")]
        public string Type { get; set; } = "";

        [JsonProperty("duration")]
        public int Duration { get; set; } = 0;

        [JsonProperty("offset")]
        public int Offset { get; set; } = 0;

        [JsonProperty("delay")]
        public int Delay { get; set; } = 0;

        [JsonProperty("easing")]
        public string Easing { get; set; }

        [JsonProperty("anchor")]
        public string Anchor { get; set; }

        [JsonProperty("mirror")]
        public bool Mirror { get; set; } = false;

        [JsonProperty("once")]
        public bool Once { get; set; } = false;

        [JsonProperty("disabled")]
        public bool Disabled { get; set; } = false;

        public Dictionary<string, object> ToDictionary()
        {
            return new Dictionary<string, object>()
            {
                { "data-aos", Type },
                { "data-aos-offset", Offset },
                { "data-aos-delay", Delay},
                { "data-aos-duration", Duration },
                { "data-aos-easing", Easing },
                { "data-aos-mirror", Mirror },
                { "data-aos-once", Once },
                { "data-aos-anchor-placement", Anchor }
            };

        }

        public override string ToString()
        {
            if (!Disabled && string.IsNullOrEmpty(Type) && Duration == 0)
                return "";

            return string.Join(" ", ToDictionary()
                .Where(x => x.Value != null && !string.IsNullOrEmpty(x.Value?.ToString()))
                .Select(x => $"{x.Key}=\"{x.Value.ToString().ToLower()}\"")
            );
        }



#if NET472
        public IHtmlString ToHtml()
        {
            return new HtmlString(ToString());
        }
#elif NET5_0
        public IHtmlContent ToHtml()
        {
            return new HtmlString(ToString());
        }
#endif
    }
}
