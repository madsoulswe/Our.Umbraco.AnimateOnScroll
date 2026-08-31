using Our.Umbraco.AnimateOnScroll.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

#if NET10_0_OR_GREATER
using System.Text.Json;
#else
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
#endif

#if NETFRAMEWORK
using Umbraco.Core;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
#else
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;
#endif

namespace Our.Umbraco.AnimateOnScroll.ValueConverters
{
    public class AnimateOnScrollValueConverter : PropertyValueConverterBase
    {
#if NET10_0_OR_GREATER
        private static readonly JsonSerializerOptions _serializerOptions = new JsonSerializerOptions
        {
            NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
        };
#endif

        public override object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
        {
            if (inter == null)
                return null;

            var sourceString = inter.ToString();

            if (!sourceString.DetectIsJson())
                return null;

#if NET10_0_OR_GREATER
            return JsonSerializer.Deserialize<Animation>(sourceString, _serializerOptions);
#else
            return JsonConvert.DeserializeObject<Animation>(sourceString, new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore
            });
#endif
        }
        public override bool IsConverter(IPublishedPropertyType propertyType)
        {
            return propertyType.EditorAlias == "Our.Umbraco.AnimateOnScroll";
        }

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType) => typeof(Animation);

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) => PropertyCacheLevel.Snapshot;
    }
}
