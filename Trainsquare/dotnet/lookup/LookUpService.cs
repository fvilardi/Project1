using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Text.RegularExpressions;

namespace Services
{
    public class LookupsService : ILookupsService, ILookUp
    {
        IDataProvider _data = null;

        public LookupsService(IDataProvider data)
        {
            _data = data;
        }
        public ExpandoObject GetTypes(IEnumerable<string> tableNames)
        {
            var result = new ExpandoObject();
            foreach (string table in tableNames)
            {
                switch (table)
                {
                    default:
                        result.TryAdd(ToCamelCase(table), GetData(table));
                        break;
                }

            }
            return result;
        }

        public  List<LookUp> GetData(string table)
        {
            List<LookUp> list =null;

            string procName = "";

            _data.ExecuteCmd(procName, inputParamMapper: null,
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                LookUp lookup = MapLookup(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<LookUp>();
                }

                list.Add(lookup);

            }
           );
            return list;
        }


        public LookUp MapLookup(IDataReader reader, ref int startingIndex)
        {
            LookUp lookup = new LookUp();

            lookup.Id = reader.GetInt32(startingIndex++);
            lookup.Name = reader.GetSafeString(startingIndex++);

            return lookup;
        }

        private static string ToCamelCase (string str)
        {
            string name = null;
            if (str != null)
            {
                str = Regex.Replace(str, "([A-Z])([A-Z]+)($[A-z])", m => m.Groups[1].Value +m.Groups[2].Value.ToLower() + m.Groups[3].Value);
                name = char.ToLower(str[0]) + str.Substring(1);
            }
            return name;
        }
        
    }

}
