#if NET5_0
using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Our.Umbraco.AnimateOnScroll.TagHelpers
{
	[HtmlTargetElement("*")]
	public class AOSTagHelper : TagHelper
	{
		[HtmlAttributeName("aos-animation")]
		public Models.Animation Animation { get; set; }

		[HtmlAttributeName("aos")]
		public Models.Animation AOS { get { return Animation; } set { Animation = value; } }

		public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
		{
			output.Attributes.SetAttribute("data-aos", Animation.Type);
            output.Attributes.SetAttribute("data-aos-offset", Animation.Offset);
			output.Attributes.SetAttribute("data-aos-delay", Animation.Delay);
			output.Attributes.SetAttribute("data-aos-duration", Animation.Duration);
			output.Attributes.SetAttribute("data-aos-easing", Animation.Easing);
			output.Attributes.SetAttribute("data-aos-mirror", Animation.Mirror);
			output.Attributes.SetAttribute("data-aos-once", Animation.Once);
			output.Attributes.SetAttribute("data-aos-anchor-placement", Animation.Anchor);
		}
	}
}
#endif